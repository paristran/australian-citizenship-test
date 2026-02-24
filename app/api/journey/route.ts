import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/journey - Get user's citizenship journey
export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get journey with milestones
    const { data: journey, error } = await supabase
      .from('citizenship_journeys')
      .select(`
        *,
        milestones:journey_milestones(*)
      `)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ journey })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/journey - Create or update journey
export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, years_in_australia, start_year, end_year, milestones } = body

    // Upsert journey
    const { data: journey, error: journeyError } = await supabase
      .from('citizenship_journeys')
      .upsert({
        user_id: user.id,
        title: title || 'My Citizenship Journey',
        subtitle,
        years_in_australia,
        start_year,
        end_year,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (journeyError) {
      return NextResponse.json({ error: journeyError.message }, { status: 500 })
    }

    // If milestones provided, update them
    if (milestones && milestones.length > 0) {
      // Delete existing milestones
      await supabase
        .from('journey_milestones')
        .delete()
        .eq('journey_id', journey.id)

      // Insert new milestones
      const milestonesToInsert = milestones.map((m: any, index: number) => ({
        journey_id: journey.id,
        milestone_type: m.milestone_type,
        title: m.title,
        description: m.description,
        milestone_date: m.milestone_date,
        icon: m.icon || '📍',
        display_order: index,
      }))

      const { error: milestonesError } = await supabase
        .from('journey_milestones')
        .insert(milestonesToInsert)

      if (milestonesError) {
        return NextResponse.json({ error: milestonesError.message }, { status: 500 })
      }
    }

    // Fetch complete journey with milestones
    const { data: completeJourney } = await supabase
      .from('citizenship_journeys')
      .select(`
        *,
        milestones:journey_milestones(*)
      `)
      .eq('id', journey.id)
      .single()

    return NextResponse.json({ journey: completeJourney })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/journey - Delete journey
export async function DELETE() {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('citizenship_journeys')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
