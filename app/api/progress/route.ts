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

    // Get progress
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
      // If table doesn't exist, return empty progress
      if (error.code === '42P01') {
        return NextResponse.json({ 
          progress: [],
          categoryStats: {},
          totalStudied: 0
        })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate statistics by category
    const categoryStats: Record<string, { total: number; correct: number }> = {}
    
    progress?.forEach((item: any) => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { total: 0, correct: 0 }
      }
      categoryStats[item.category].total++
      if (item.is_correct) {
        categoryStats[item.category].correct++
      }
    })

    return NextResponse.json({ 
      progress: progress || [],
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
      // If table doesn't exist, return success anyway (graceful degradation)
      if (error.code === '42P01') {
        console.log('question_progress table does not exist - run SQL schema')
        return NextResponse.json({ success: true, warning: 'Table not created yet' })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, progress: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
