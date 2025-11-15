import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GeneratedQuestion {
  question: string
  options: string[] // Array of 4 answer choices
  correct_answer: number // Index 0-3
  explanation: string
  difficulty?: 'easy' | 'medium' | 'hard'
  topic_tags?: string[]
}

/**
 * Generates questions from knowledge base text using OpenAI
 */
export async function generateQuestionsFromText(
  knowledgeBaseText: string,
  eventName: string,
  additionalContext: string | null,
  questionCount: number
): Promise<GeneratedQuestion[]> {
  // Combine all knowledge base text
  const fullText = knowledgeBaseText

  // Build the prompt
  const contextPrompt = additionalContext
    ? `\n\nAdditional Context: ${additionalContext}`
    : ''

  const systemPrompt = `You are an expert question generator for competitive business exams (DECA and FBLA). 
Your task is to generate high-quality multiple-choice questions that match the style and format of official DECA practice tests.

DECA Question Style Guidelines:
- Questions are direct and test specific business concepts, principles, or procedures
- Questions often start with "What", "Which", "How", or "Why" 
- Questions test understanding of business terminology, processes, and real-world applications
- Answer choices are concise (typically 1-8 words each)
- Distractors (wrong answers) are plausible but clearly incorrect
- Questions reference specific business scenarios, legal concepts, or operational procedures
- Difficulty ranges from straightforward definitions to application-based scenarios

Requirements:
- Generate exactly ${questionCount} multiple-choice question(s)
- Each question must have exactly 4 answer options (A, B, C, D)
- Questions MUST be based directly on the provided knowledge base content
- Questions should test understanding of concepts, not just recall
- Answer choices should be concise and parallel in structure
- Include a clear, educational explanation that references the concept being tested
- Format your response as a JSON object with a "questions" array

Response Format:
{
  "questions": [
    {
      "question": "The question text here (direct, clear, tests a specific concept)",
      "options": ["Option A (concise)", "Option B (concise)", "Option C (concise)", "Option D (concise)"],
      "correct_answer": 0,  // Index of correct answer (0-3)
      "explanation": "Clear explanation referencing the business concept, why the answer is correct, and why other options are incorrect",
      "difficulty": "medium",  // "easy", "medium", or "hard"
      "topic_tags": ["topic1", "topic2"]  // Relevant business topics/concepts
    }
  ]
}

Return ONLY a valid JSON object, no other text.`

  const userPrompt = `Generate ${questionCount} multiple-choice question(s) for the event: ${eventName}

Knowledge Base Content:
${fullText.substring(0, 15000)}${fullText.length > 15000 ? '\n\n[... content truncated for length ...]' : ''}${contextPrompt}

Generate questions that test understanding of the concepts in the knowledge base.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency, can upgrade to gpt-4o if needed
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let parsed: { questions?: GeneratedQuestion[] }
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks if present
      console.error('JSON parse error, trying alternative parsing:', parseError)
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/(\{[\s\S]*\})/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1])
      } else {
        // Last resort: try to parse as array directly
        const arrayMatch = content.match(/\[[\s\S]*\]/)
        if (arrayMatch) {
          const arrayData = JSON.parse(arrayMatch[0])
          parsed = { questions: Array.isArray(arrayData) ? arrayData : [arrayData] }
        } else {
          throw new Error('Could not parse OpenAI response as JSON')
        }
      }
    }

    // Extract questions from the parsed object
    const questions: GeneratedQuestion[] = parsed.questions || []

    // Validate and clean questions
    const validatedQuestions: GeneratedQuestion[] = questions
      .filter((q) => {
        // Ensure all required fields are present
        return (
          q.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correct_answer === 'number' &&
          q.correct_answer >= 0 &&
          q.correct_answer < 4 &&
          q.explanation
        )
      })
      .map((q) => ({
        question: q.question.trim(),
        options: q.options.map((opt) => opt.trim()),
        correct_answer: q.correct_answer,
        explanation: q.explanation.trim(),
        difficulty: q.difficulty || 'medium',
        topic_tags: q.topic_tags || [],
      }))

    if (validatedQuestions.length === 0) {
      throw new Error('No valid questions generated')
    }

    return validatedQuestions
  } catch (error) {
    console.error('Error generating questions with OpenAI:', error)
    throw error
  }
}

/**
 * Chunks text for better context retrieval
 */
export function chunkText(text: string, chunkSize: number = 2000, overlap: number = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    let chunk = text.slice(start, end)

    // Try to break at sentence boundaries
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.')
      const lastNewline = chunk.lastIndexOf('\n')
      const breakPoint = Math.max(lastPeriod, lastNewline)

      if (breakPoint > chunkSize * 0.5) {
        chunk = text.slice(start, start + breakPoint + 1)
        start = start + breakPoint + 1 - overlap
      } else {
        start = end - overlap
      }
    } else {
      start = end
    }

    chunks.push(chunk.trim())
  }

  return chunks.filter((chunk) => chunk.length > 0)
}

