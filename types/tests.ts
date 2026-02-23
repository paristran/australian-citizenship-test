import { Database } from './database'

type TestAttempt = Database['public']['Tables']['test_attempts']['Row']
type TestAnswer = Database['public']['Tables']['test_answers']['Row']

export interface TestAttemptWithAnswers extends TestAttempt {
  answers: TestAnswer[]
}

export interface UserTestProgress {
  totalAttempts: number
  completedAttempts: number
  averageScore: number
  highestScore: number
  recentAttempts: TestAttempt[]
}

export interface TestResult {
  attemptId: string
  score: number
  totalQuestions: number
  percentage: number
  correctAnswers: number
  wrongAnswers: number
  timeSpent: number
  passed: boolean
}

export type { TestAttempt, TestAnswer }
