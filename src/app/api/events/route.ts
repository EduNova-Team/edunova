import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organization = searchParams.get('organization')

          let query = supabase
            .from('events')
            .select('id, name, organization, slug, description, image_url, created_at, updated_at')
            .order('name', { ascending: true })

    if (organization && organization !== 'All') {
      if (organization === 'DECA') {
        query = query.or('organization.eq.DECA,organization.eq.Both')
      } else if (organization === 'FBLA') {
        query = query.or('organization.eq.FBLA,organization.eq.Both')
      } else {
        query = query.eq('organization', organization)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events: data || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

