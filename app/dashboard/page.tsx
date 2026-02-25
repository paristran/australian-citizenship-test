'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'

interface CategoryProgress {
  category: string
  total: number
  correct: number
  percentage: number
  lastStudied?: string
  recentQuestions: any[]
}

interface TestAttempt {
  id: string
  score: number
  total_questions: number
  values_score: number
  values_total: number
  passed: boolean
  completed_at: string
  answers?: any[]
}

interface DashboardStats {
  totalTests: number
  passedTests: number
  passRate: number
  avgScore: number
  totalQuestionsStudied: number
  strongestCategory: string
  weakestCategory: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([])
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch progress data
      const progressRes = await fetch('/api/progress')
      const progressData = await progressRes.json()

      // Fetch test attempts
      const attemptsRes = await fetch('/api/test-attempts?limit=10')
      const attemptsData = await attemptsRes.json()

      // Process category progress
      const categories = [
        'Australia and its people',
        'Government and law',
        'Democratic beliefs',
        'Australian values'
      ]

      const categoryStats: CategoryProgress[] = categories.map(category => {
        const categoryQuestions = progressData.progress?.filter((p: any) => p.category === category) || []
        const total = categoryQuestions.length
        const correct = categoryQuestions.filter((p: any) => p.is_correct).length
        
        return {
          category,
          total,
          correct,
          percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
          lastStudied: categoryQuestions[0]?.studied_at,
          recentQuestions: categoryQuestions.slice(0, 5)
        }
      })

      setCategoryProgress(categoryStats)
      setTestAttempts(attemptsData.attempts || [])

      // Calculate overall stats
      const attempts = attemptsData.attempts || []
      const totalTests = attempts.length
      const passedTests = attempts.filter((a: TestAttempt) => a.passed).length
      
      const stats: DashboardStats = {
        totalTests,
        passedTests,
        passRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
        avgScore: totalTests > 0 
          ? Math.round((attempts.reduce((sum: number, a: TestAttempt) => sum + a.score, 0) / totalTests) * 10) / 10 
          : 0,
        totalQuestionsStudied: progressData.totalStudied || 0,
        strongestCategory: categoryStats.reduce((best, cat) => 
          cat.percentage > (best?.percentage || 0) && cat.total >= 5 ? cat : best, categoryStats[0])?.category || '',
        weakestCategory: categoryStats.reduce((worst, cat) => 
          cat.percentage < (worst?.percentage || 100) && cat.total >= 5 ? cat : worst, categoryStats[0])?.category || ''
      }

      setStats(stats)

      // Generate personalized recommendations
      const tips = generateRecommendations(categoryStats, attempts)
      setRecommendations(tips)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const generateRecommendations = (categories: CategoryProgress[], attempts: TestAttempt[]): string[] => {
    const tips: string[] = []
    
    // Check Australian values (must be 100%)
    const valuesCategory = categories.find(c => c.category === 'Australian values')
    if (valuesCategory && valuesCategory.percentage < 100 && valuesCategory.total >= 5) {
      tips.push(`🎯 Focus on Australian Values - You need 100% correct on these questions to pass the test. Current: ${valuesCategory.percentage}%`)
    }

    // Check overall weak areas
    const weakCategories = categories.filter(c => c.percentage < 75 && c.total >= 5)
    if (weakCategories.length > 0) {
      weakCategories.forEach(cat => {
        tips.push(`📖 Practice "${cat.category}" more - Current accuracy: ${cat.percentage}%`)
      })
    }

    // Check test performance
    const recentAttempts = attempts.slice(0, 5)
    const recentPassRate = recentAttempts.filter(a => a.passed).length / recentAttempts.length
    
    if (recentAttempts.length >= 3 && recentPassRate < 0.6) {
      tips.push('📝 Take more practice tests - Try to improve your consistency')
    }

    // Check if not enough practice
    const totalStudied = categories.reduce((sum, c) => sum + c.total, 0)
    if (totalStudied < 100) {
      tips.push(`📚 Study more questions - You've practiced ${totalStudied} out of 500 questions`)
    }

    // Encourage good performance
    if (recentPassRate >= 0.8 && recentAttempts.length >= 3) {
      tips.push('⭐ Great job! You\'re doing well - keep practicing to maintain your performance')
    }

    // Values score specific
    const failedValues = attempts.filter(a => a.values_score < 5).slice(0, 3)
    if (failedValues.length > 0) {
      tips.push('⚠️ Review Australian Values questions - You must get all 5 correct to pass')
    }

    return tips.length > 0 ? tips : ['💪 Keep studying to build your skills!']
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🇦🇺</div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Track your progress and improve your citizenship knowledge</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Total Tests</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalTests}</div>
              <div className="text-sm text-green-600 mt-2">{stats.passedTests} passed</div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Pass Rate</div>
              <div className="text-3xl font-bold text-gray-900">{stats.passRate}%</div>
              <div className="text-sm text-gray-500 mt-2">of attempts</div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Avg Score</div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgScore}/20</div>
              <div className="text-sm text-gray-500 mt-2">on practice tests</div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 mb-1">Questions Studied</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalQuestionsStudied}</div>
              <div className="text-sm text-gray-500 mt-2">out of 500</div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Category Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Progress by Category</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {categoryProgress.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">{cat.category}</h3>
                        <span className="text-sm text-gray-500">
                          {cat.total} questions studied
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            cat.percentage >= 80 ? 'bg-green-500' :
                            cat.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          <span className="font-semibold">{cat.correct}</span>/{cat.total} correct
                        </span>
                        <span className="text-sm font-semibold">{cat.percentage}%</span>
                      </div>
                      
                      {cat.lastStudied && (
                        <p className="text-xs text-gray-400 mt-2">
                          Last studied {formatDistanceToNow(new Date(cat.lastStudied))} ago
                        </p>
                      )}
                      
                      {cat.total > 0 && (
                        <Link
                          href={`/study/${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="inline-block mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          Continue studying →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Test History */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold">Practice Test History</h2>
                <Link
                  href="/test"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Take New Test
                </Link>
              </div>
              <div className="p-6">
                {testAttempts.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No practice tests taken yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testAttempts.map((attempt) => (
                      <div 
                        key={attempt.id} 
                        className={`p-4 rounded-lg border-2 ${
                          attempt.passed 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-lg font-bold ${attempt.passed ? 'text-green-700' : 'text-red-700'}`}>
                                {attempt.passed ? '✓ PASSED' : '✗ NOT PASSED'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Overall:</span>
                                <span className="font-semibold ml-2">{attempt.score}/{attempt.total_questions}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Values:</span>
                                <span className={`font-semibold ml-2 ${attempt.values_score === 5 ? 'text-green-700' : 'text-red-700'}`}>
                                  {attempt.values_score}/{attempt.values_total}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              {format(new Date(attempt.completed_at), 'MMM d, yyyy \'at\' h:mm a')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">
                              {Math.round((attempt.score / attempt.total_questions) * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Personalized Tips</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recommendations.map((tip, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/test"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  📝 Take Practice Test
                </Link>
                <Link
                  href="/study"
                  className="block w-full bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  📚 Study Questions
                </Link>
                <Link
                  href="/journey"
                  className="block w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  🇦🇺 My Journey
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
