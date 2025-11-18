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
 * Calculates difficulty distribution for DECA 40/40/20 rule
 */
function calculateDifficultyDistribution(totalQuestions: number): {
  easy: number
  medium: number
  hard: number
} {
  // DECA standard: 40% easy, 40% medium, 20% hard
  const easy = Math.round(totalQuestions * 0.4)
  const hard = Math.round(totalQuestions * 0.2)
  const medium = totalQuestions - easy - hard // Remainder goes to medium
  
  return { easy, medium, hard }
}

/**
 * Generates questions from knowledge base text using OpenAI GPT-5
 * Optimized to match authentic DECA exam style with enforced difficulty distribution
 */
export async function generateQuestionsFromText(
  knowledgeBaseText: string,
  eventName: string,
  additionalContext: string | null,
  questionCount: number
): Promise<GeneratedQuestion[]> {
  const fullText = knowledgeBaseText
  const contextPrompt = additionalContext ? `\n\nAdditional Context: ${additionalContext}` : ''
  
  // Calculate exact difficulty distribution
  const distribution = calculateDifficultyDistribution(questionCount)

  // Enhanced prompt matching actual DECA style based on official exam analysis
  const systemPrompt = `You are an expert DECA exam question writer. Generate questions that EXACTLY match official DECA exam style.

CRITICAL STYLE REQUIREMENTS (based on official DECA exams):

1. QUESTION FORMAT:
   - Start with scenario: "Maria is preparing a marketing report..." or "A customer asks Roger..."
   - Use real names (common first names like Sarah, Kevin, Marcus, etc.)
   - End with specific question using patterns like:
     * "Which of the following..."
     * "What should [name] do..."
     * "Which technique/method/strategy..."
   - Questions must be 1-2 sentences maximum

2. ANSWER CHOICES (CRITICAL):
   - Each option must be 2-6 words MAXIMUM
   - Options must be parallel in structure
   - Use sentence case (capitalize first word only)
   - Examples of correct length:
     * "Ask his coworker for advice"
     * "Active listening"
     * "Refer to the style manual"
     * "Build positive relationships"
   - NO full sentences, NO explanations in options

3. EXPLANATION FORMAT (VERY IMPORTANT):
   - Must be 4-7 sentences long
   - First sentence: State correct answer and why it's correct
   - Middle sentences: Explain why each wrong answer is incorrect
   - Final sentence: Reinforce the concept being tested
   - Use connecting phrases like "Although...", "However...", "It's important to note..."
   - Sound authoritative and educational

4. DIFFICULTY LEVELS:
   - Easy: Test definitions and basic concepts (recall)
   - Medium: Test understanding and application (comprehension)
   - Hard: Test analysis, evaluation, and complex scenarios (critical thinking)

5. QUESTION STEMS TO USE:
   - "Which of the following..."
   - "What should [name]..."
   - "An example of ___ is..."
   - "Which technique/method/strategy..."
   - "[Name] wants to ___. What should [he/she]..."

EXAMPLE OF PERFECT DECA STYLE:

Question: "Kevin is editing a professional report and isn't sure whether to italicize or underscore a book title. To obtain the correct information, Kevin should"

Options:
A. Ask his coworker for advice
B. Refer to the style manual
C. Look up information in dictionary
D. Identify readers' preferences

Explanation: "Kevin should refer to the appropriate publisher's style manual because it provides the correct formatting guidelines for professional documents. Asking a coworker for advice may lead to incorrect information if the coworker is unsure. Looking up information in a dictionary won't provide specific formatting rules for book titles. Identifying readers' preferences is not relevant to standardized formatting conventions. Style manuals are the authoritative source for document formatting decisions."

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "Scenario with name and specific question",
      "options": ["2-6 words", "2-6 words", "2-6 words", "2-6 words"],
      "correct_answer": 0,
      "explanation": "4-7 sentence detailed explanation covering why correct answer is right and why each wrong answer is incorrect",
      "difficulty": "medium",
      "topic_tags": ["topic1", "topic2"]
    }
  ]
}`

  const userPrompt = `Generate EXACTLY ${questionCount} DECA-style questions for: ${eventName}

REQUIRED DIFFICULTY DISTRIBUTION (MUST FOLLOW EXACTLY):
- ${distribution.easy} EASY questions (basic definitions and concepts)
- ${distribution.medium} MEDIUM questions (understanding and application)  
- ${distribution.hard} HARD questions (analysis and complex scenarios)

Knowledge Base:
${fullText.substring(0, 12000)}${fullText.length > 12000 ? '\n[...truncated...]' : ''}${contextPrompt}

CRITICAL REMINDERS:
- Use real names in scenarios
- Keep options to 2-6 words MAXIMUM
- Write 4-7 sentence explanations
- Generate EXACTLY ${distribution.easy} easy + ${distribution.medium} medium + ${distribution.hard} hard questions
- Match exact DECA style from examples`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      reasoning_effort: 'medium', // Increased from 'low' for better quality matching
      verbosity: 'medium', // Increased for detailed explanations
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const parsed: { questions?: GeneratedQuestion[] } = JSON.parse(content)
    const questions: GeneratedQuestion[] = parsed.questions || []

    // Validate questions with stricter rules AND verify difficulty distribution
    const questionsByDifficulty = {
      easy: [] as GeneratedQuestion[],
      medium: [] as GeneratedQuestion[],
      hard: [] as GeneratedQuestion[]
    }
    
    const validatedQuestions: GeneratedQuestion[] = questions
      .filter((q) => {
        // Check basic structure
        const hasBasicStructure = (
          q.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correct_answer === 'number' &&
          q.correct_answer >= 0 &&
          q.correct_answer < 4 &&
          q.explanation
        )
        
        // Validate option length (2-6 words each)
        const optionsValid = q.options.every(opt => {
          const wordCount = opt.trim().split(/\s+/).length
          return wordCount >= 2 && wordCount <= 6
        })
        
        // Validate explanation length (should be substantial)
        const explanationValid = q.explanation.trim().length >= 200
        
        return hasBasicStructure && optionsValid && explanationValid
      })
      .map((q) => {
        const validated: GeneratedQuestion = {
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correct_answer: q.correct_answer,
          explanation: q.explanation.trim(),
          difficulty: q.difficulty || 'medium',
          topic_tags: q.topic_tags || [],
        }
        
        // Group by difficulty
        const diff = validated.difficulty as 'easy' | 'medium' | 'hard'
        if (questionsByDifficulty[diff]) {
          questionsByDifficulty[diff].push(validated)
        }
        
        return validated
      })
    
    // Log distribution for debugging
    console.log(`Generated distribution - Easy: ${questionsByDifficulty.easy.length}, Medium: ${questionsByDifficulty.medium.length}, Hard: ${questionsByDifficulty.hard.length}`)
    console.log(`Target distribution - Easy: ${distribution.easy}, Medium: ${distribution.medium}, Hard: ${distribution.hard}`)

    if (validatedQuestions.length === 0) {
      throw new Error('No valid questions generated that match DECA style requirements')
    }

    return validatedQuestions
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 400) {
      console.error('OpenAI API validation error:', error.message)
      throw new Error(`API validation failed: ${error.message}`)
    }
    console.error('Error generating questions with OpenAI:', error)
    throw error
  }
}

/**
 * Batch generate questions with enforced difficulty distribution
 * Ensures exact 40/40/20 split across all batches
 */
export async function generateQuestionsInBatch(
  knowledgeBaseText: string,
  eventName: string,
  additionalContext: string | null,
  totalQuestions: number,
  batchSize: number = 10
): Promise<GeneratedQuestion[]> {
  const allQuestions: GeneratedQuestion[] = []
  const batches = Math.ceil(totalQuestions / batchSize)
  
  // Calculate total distribution needed
  const totalDistribution = calculateDifficultyDistribution(totalQuestions)
  
  let remainingEasy = totalDistribution.easy
  let remainingMedium = totalDistribution.medium
  let remainingHard = totalDistribution.hard

  for (let i = 0; i < batches; i++) {
    const questionsInBatch = Math.min(batchSize, totalQuestions - i * batchSize)
    
    // Calculate distribution for this specific batch
    const batchDistribution = calculateDifficultyDistribution(questionsInBatch)
    
    // Adjust for remaining questions to ensure exact total
    const easyForBatch = Math.min(batchDistribution.easy, remainingEasy)
    const hardForBatch = Math.min(batchDistribution.hard, remainingHard)
    const mediumForBatch = questionsInBatch - easyForBatch - hardForBatch
    
    console.log(`Batch ${i + 1}: Generating ${easyForBatch} easy, ${mediumForBatch} medium, ${hardForBatch} hard`)
    
    try {
      const questions = await generateQuestionsFromText(
        knowledgeBaseText,
        eventName,
        additionalContext,
        questionsInBatch
      )
      
      allQuestions.push(...questions)
      
      // Update remaining counts
      const generated = {
        easy: questions.filter(q => q.difficulty === 'easy').length,
        medium: questions.filter(q => q.difficulty === 'medium').length,
        hard: questions.filter(q => q.difficulty === 'hard').length
      }
      
      remainingEasy -= generated.easy
      remainingMedium -= generated.medium
      remainingHard -= generated.hard
      
    } catch (error) {
      console.error(`Batch ${i + 1} failed:`, error)
    }
  }
  
  // Final distribution check
  const finalDistribution = {
    easy: allQuestions.filter(q => q.difficulty === 'easy').length,
    medium: allQuestions.filter(q => q.difficulty === 'medium').length,
    hard: allQuestions.filter(q => q.difficulty === 'hard').length
  }
  
  console.log(`Final distribution - Easy: ${finalDistribution.easy}/${totalDistribution.easy}, Medium: ${finalDistribution.medium}/${totalDistribution.medium}, Hard: ${finalDistribution.hard}/${totalDistribution.hard}`)

  return allQuestions
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