import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/progress - Get user's study progress
export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Get progress with question details
    let query = supabase
      .from('question_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('studied_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: progress, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get statistics by category
    const { data: stats } = await supabase
      .from('question_progress')
      .select('category, is_correct')
      .eq('user_id', user.id)

    const categoryStats = stats?.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { total: 0, correct: 0 }
      }
      acc[item.category].total++
      if (item.is_correct) acc[item.category].correct++
      return acc
    }, {})

    return NextResponse.json({ 
      progress,
      categoryStats,
      totalStudied: progress?.length || 0
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/progress - Record question completion
export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { question_id, category, is_correct } = body

    if (!question_id || !category || typeof is_correct !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('question_progress')
      .upsert({
        user_id: user.id,
        question_id,
        category,
        is_correct,
        studied_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,question_id'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, progress: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
