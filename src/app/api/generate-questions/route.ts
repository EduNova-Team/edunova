import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This will be implemented in Phase 4 with OpenAI
// For now, this is a placeholder that validates the request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, knowledgeBaseIds, questionCount } = body

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

    // Verify knowledge base entries exist
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

    // Create generation record
    const { data: generation, error: genError } = await supabase
      .from('question_generations')
      .insert({
        event_id: eventId,
        knowledge_base_ids: knowledgeBaseIds,
        requested_count: questionCount,
        status: 'pending',
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

    // TODO: In Phase 4, this will call OpenAI API to generate questions
    // For now, return the generation ID for tracking
    return NextResponse.json({
      success: true,
      generationId: generation.id,
      message: 'Generation job created. OpenAI integration will be added in Phase 4.',
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

