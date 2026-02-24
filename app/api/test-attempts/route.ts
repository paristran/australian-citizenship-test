import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/test-attempts - Get user's test history
export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data: attempts, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate statistics
    const totalAttempts = attempts?.length || 0
    const passedAttempts = attempts?.filter(a => a.passed).length || 0
    const avgScore = attempts?.length 
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length 
      : 0
    const avgValuesScore = attempts?.length 
      ? attempts.reduce((sum, a) => sum + (a.values_score || 0), 0) / attempts.length 
      : 0

    return NextResponse.json({ 
      attempts,
      stats: {
        total: totalAttempts,
        passed: passedAttempts,
        passRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
        avgScore: Math.round(avgScore * 10) / 10,
        avgValuesScore: Math.round(avgValuesScore * 10) / 10
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/test-attempts - Save a new test attempt
export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      score, 
      total_questions, 
      values_score,
      values_total,
      passed, 
      answers 
    } = body

    // Validate required fields
    if (typeof score !== 'number' || typeof passed !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save test attempt
    const { data, error } = await supabase
      .from('test_attempts')
      .insert({
        user_id: user.id,
        score,
        total_questions: total_questions || 20,
        values_score: values_score || 0,
        values_total: values_total || 5,
        passed,
        answers,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving test attempt:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, attempt: data })
  } catch (error: any) {
    console.error('Error in POST /api/test-attempts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
