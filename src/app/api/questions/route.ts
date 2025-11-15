import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventIdOrSlug = searchParams.get('eventId')
    const limit = searchParams.get('limit')
    const publishedOnly = searchParams.get('publishedOnly') !== 'false' // Default to true

    if (!eventIdOrSlug) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      )
    }

    // Check if eventIdOrSlug is a UUID or a slug
    // UUIDs have format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventIdOrSlug)
    
    let actualEventId = eventIdOrSlug

    // If it's not a UUID, it's a slug - look up the event
    if (!isUUID) {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id')
        .eq('slug', eventIdOrSlug)
        .single()

      if (eventError || !event) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }

      actualEventId = event.id
    }

    let query = supabase
      .from('questions')
      .select('*')
      .eq('event_id', actualEventId)
      .order('created_at', { ascending: false })

    // Filter by published status
    if (publishedOnly) {
      query = query.eq('is_published', true)
    }

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum)
      }
    }

    const { data: questions, error } = await query

    if (error) {
      console.error('Error fetching questions:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Transform questions to match quiz format
    const formattedQuestions = (questions || []).map((q) => ({
      id: q.id,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topicTags: q.topic_tags || [],
    }))

    return NextResponse.json({
      questions: formattedQuestions,
      count: formattedQuestions.length,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

