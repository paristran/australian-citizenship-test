import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { score, totalQuestions, percentage, timeSpentSeconds, answers } = body

    // Create test attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('test_attempts')
      .insert({
        user_id: user.id,
        score,
        total_questions: totalQuestions,
        percentage,
        time_spent_seconds: timeSpentSeconds,
        status: 'completed',
        completed_at: new Date().toISOString(),
      } as any)
      .select()
      .single()

    if (attemptError) {
      console.error('Error creating attempt:', attemptError)
      return NextResponse.json({ error: attemptError.message }, { status: 500 })
    }

    // Save answers
    if (answers && answers.length > 0) {
      const answersData = answers.map((a: any) => ({
        attempt_id: attempt.id,
        question_id: a.questionId,
        selected_answer: a.selectedAnswer,
        is_correct: a.isCorrect,
      }))

      const { error: answersError } = await supabase
        .from('test_answers')
        .insert(answersData as any)

      if (answersError) {
        console.error('Error saving answers:', answersError)
      }
    }

    return NextResponse.json({ success: true, attempt })
  } catch (error) {
    console.error('Error in POST /api/test-attempts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'

    const { data: attempts, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ attempts })
  } catch (error) {
    console.error('Error in GET /api/test-attempts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
