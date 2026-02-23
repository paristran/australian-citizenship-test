'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TestAttempt } from '@/types/tests'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [attempts, setAttempts] = useState<TestAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient()
    : null

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && supabase) {
      fetchAttempts()
    } else if (!supabase) {
      setLoading(false)
    }
  }, [user, supabase])

  const fetchAttempts = async () => {
    if (!supabase || !user) return
    
    const { data, error } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAttempts(data)
    }
    setLoading(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🇦🇺</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const completedAttempts = attempts.filter((a) => a.status === 'completed')
  const averageScore =
    completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + a.percentage, 0) / completedAttempts.length
      : 0

  const highestScore =
    completedAttempts.length > 0
      ? Math.max(...completedAttempts.map((a) => a.percentage))
      : 0

  const chartData = completedAttempts
    .slice(0, 10)
    .reverse()
    .map((a, i) => ({
      name: `Test ${i + 1}`,
      score: a.percentage,
    }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🇦🇺</span>
            <span className="font-bold text-xl">GetCitizenship</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-gray-700 hover:text-gray-900 transition"
            >
              {profile?.full_name || user.email}
            </Link>
            <button
              onClick={signOut}
              className="text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Citizen'}! 👋
          </h1>
          <p className="text-gray-600">
            Track your progress and continue preparing for your citizenship test
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold">{completedAttempts.length}</div>
            <div className="text-gray-600 text-sm">Tests Completed</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold">{averageScore.toFixed(1)}%</div>
            <div className="text-gray-600 text-sm">Average Score</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold">{highestScore.toFixed(1)}%</div>
            <div className="text-gray-600 text-sm">Highest Score</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">
              {averageScore >= 75 ? '✅' : '📚'}
            </div>
            <div className="text-3xl font-bold">
              {averageScore >= 75 ? 'Ready' : 'Keep Going'}
            </div>
            <div className="text-gray-600 text-sm">
              {averageScore >= 75 ? 'Test Ready' : 'Practice More'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/test"
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-lg p-8 flex items-center justify-between transition-colors"
          >
            <div>
              <div className="text-5xl mb-3">🎯</div>
              <h3 className="text-2xl font-bold mb-2">Take a Practice Test</h3>
              <p className="opacity-90">20 questions, 45 minutes</p>
            </div>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/study"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg p-8 flex items-center justify-between transition-colors"
          >
            <div>
              <div className="text-5xl mb-3">📚</div>
              <h3 className="text-2xl font-bold mb-2">Study Mode</h3>
              <p className="opacity-90">Learn with instant feedback</p>
            </div>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Progress Chart */}
        {completedAttempts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis domain={[0, 100]} stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00843D"
                  strokeWidth={3}
                  dot={{ fill: '#00843D', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Tests */}
        {completedAttempts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Recent Tests</h2>
            <div className="space-y-4">
              {completedAttempts.slice(0, 5).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <div className="font-semibold">
                      Score: {attempt.score}/{attempt.total_questions}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(attempt.created_at).toLocaleDateString('en-AU', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg font-bold ${
                      attempt.percentage >= 75
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {attempt.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {completedAttempts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-gray-600 mb-6">
              Take your first practice test to begin tracking your progress
            </p>
            <Link
              href="/test"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Start Practice Test
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
