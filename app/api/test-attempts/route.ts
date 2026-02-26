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
      console.error('Error fetching test attempts:', error)
      // Return empty if table doesn't exist
      if (error.code === '42P01') {
        return NextResponse.json({ 
          attempts: [],
          stats: { total: 0, passed: 0, passRate: 0, avgScore: 0 }
        })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate statistics
    const totalAttempts = attempts?.length || 0
    const passedAttempts = attempts?.filter(a => a.passed).length || 0
    const avgScore = attempts?.length 
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length 
      : 0

    return NextResponse.json({ 
      attempts: attempts || [],
      stats: {
        total: totalAttempts,
        passed: passedAttempts,
        passRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
        avgScore: Math.round(avgScore * 10) / 10
      }
    })
  } catch (error: any) {
    console.error('Error in GET /api/test-attempts:', error)
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

    console.log('Saving test attempt:', { userId: user.id, score, passed })

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
      // Return success anyway if table doesn't exist (graceful degradation)
      if (error.code === '42P01') {
        console.log('test_attempts table does not exist')
        return NextResponse.json({ success: true, warning: 'Table not created' })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Test attempt saved:', data)

    return NextResponse.json({ success: true, attempt: data })
  } catch (error: any) {
    console.error('Error in POST /api/test-attempts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
