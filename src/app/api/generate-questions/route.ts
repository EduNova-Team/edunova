import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateQuestionsFromText } from '@/lib/openai-question-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, knowledgeBaseIds, questionCount, additionalContext } = body

    if (!eventId || !knowledgeBaseIds || !Array.isArray(knowledgeBaseIds) || knowledgeBaseIds.length === 0) {
      return NextResponse.json(
        { error: 'eventId and knowledgeBaseIds array are required' },
        { status: 400 }
      )
    }

    if (!questionCount || questionCount < 1 || questionCount > 100) {
      return NextResponse.json(
        { error: 'questionCount must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Verify event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, name')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Verify knowledge base entries exist and get their text
    const { data: kbEntries, error: kbError } = await supabase
      .from('knowledge_base')
      .select('id, extracted_text')
      .in('id', knowledgeBaseIds)

    if (kbError || !kbEntries || kbEntries.length === 0) {
      return NextResponse.json(
        { error: 'Knowledge base entries not found' },
        { status: 404 }
      )
    }

    // Combine all knowledge base text
    const combinedText = kbEntries
      .map((kb) => kb.extracted_text || '')
      .filter((text) => text.trim().length > 0)
      .join('\n\n---\n\n')

    if (!combinedText || combinedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text content found in knowledge base entries' },
        { status: 400 }
      )
    }

    // Create generation record with 'processing' status
    const { data: generation, error: genError } = await supabase
      .from('question_generations')
      .insert({
        event_id: eventId,
        knowledge_base_ids: knowledgeBaseIds,
        requested_count: questionCount,
        additional_context: additionalContext || null,
        status: 'processing',
      })
      .select()
      .single()

    if (genError) {
      console.error('Error creating generation record:', genError)
      return NextResponse.json(
        { error: 'Failed to create generation record' },
        { status: 500 }
      )
    }

    // Generate questions using OpenAI (don't await - process in background)
    // We'll return immediately and process async
    generateQuestionsAsync(
      generation.id,
      eventId,
      combinedText,
      event.name,
      additionalContext,
      questionCount,
      knowledgeBaseIds[0] // Use first knowledge base ID as primary
    ).catch((error) => {
      console.error('Error in background question generation:', error)
      // Update generation status to failed
      supabase
        .from('question_generations')
        .update({
          status: 'failed',
          error_message: error.message || 'Unknown error during question generation',
        })
        .eq('id', generation.id)
    })

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      message: `Question generation started! Generating ${questionCount} question(s) for ${event.name}. This may take a few moments.`,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Async function to generate questions and save them to the database
 */
async function generateQuestionsAsync(
  generationId: string,
  eventId: string,
  knowledgeBaseText: string,
  eventName: string,
  additionalContext: string | null,
  questionCount: number,
  primaryKnowledgeBaseId: string
) {
  try {
    // Generate questions using OpenAI
    const generatedQuestions = await generateQuestionsFromText(
      knowledgeBaseText,
      eventName,
      additionalContext,
      questionCount
    )

    // Save questions to database (set is_published to true so they're immediately available)
    const questionsToInsert = generatedQuestions.map((q) => ({
      event_id: eventId,
      knowledge_base_id: primaryKnowledgeBaseId,
      generation_id: generationId,
      question: q.question,
      options: q.options, // Stored as JSONB
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty || 'medium',
      topic_tags: q.topic_tags || [],
      is_published: true, // Auto-publish generated questions
    }))

    const { error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)

    if (insertError) {
      throw new Error(`Failed to save questions: ${insertError.message}`)
    }

    // Update generation record to completed
    const { error: updateError } = await supabase
      .from('question_generations')
      .update({
        status: 'completed',
        generated_count: generatedQuestions.length,
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId)

    if (updateError) {
      console.error('Error updating generation status:', updateError)
    }

    // Update event question_count
    const { error: countError } = await supabase.rpc('increment_event_question_count', {
      event_id_param: eventId,
      increment_by: generatedQuestions.length,
    })

    // If RPC doesn't exist, use direct update
    if (countError) {
      // Get current count and update
      const { data: eventData } = await supabase
        .from('events')
        .select('question_count')
        .eq('id', eventId)
        .single()

      if (eventData) {
        await supabase
          .from('events')
          .update({
            question_count: (eventData.question_count || 0) + generatedQuestions.length,
          })
          .eq('id', eventId)
      }
    }

    console.log(`Successfully generated and saved ${generatedQuestions.length} questions for generation ${generationId}`)
  } catch (error) {
    console.error('Error generating questions:', error)
    
    // Update generation status to failed
    await supabase
      .from('question_generations')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', generationId)
    
    throw error
  }
}

