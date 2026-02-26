'use client'

import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

const categories = [
  {
    name: 'Australia and its people',
    slug: 'australia-and-its-people',
    icon: '🇦🇺',
    description: 'Learn about Australia\'s history, culture, geography, and people',
    questionCount: 120
  },
  {
    name: 'Government and law',
    slug: 'government-and-law',
    icon: '⚖️',
    description: 'Understand Australia\'s government, constitution, and legal system',
    questionCount: 70
  },
  {
    name: 'Democratic beliefs',
    slug: 'democratic-beliefs',
    icon: '🗳️',
    description: 'Learn about Australia\'s democratic values and rights',
    questionCount: 35
  },
  {
    name: 'Australian values',
    slug: 'australian-values',
    icon: '🌟',
    description: 'Understand the values that shape Australian society',
    questionCount: 25
  }
]

export default function StudyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/study')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🇦🇺</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">📚 Study Mode</h1>
          <p className="text-gray-600">Choose a category to start learning</p>
        </div>

        <div className="grid gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/study/${category.slug}`}
              className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{category.icon}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h2>
                  <p className="text-gray-600 mb-3">{category.description}</p>
                  <div className="text-sm text-green-600 font-medium">
                    {category.questionCount} questions
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/test" className="text-green-600 hover:text-green-700 font-medium">
            Ready for a practice test? →
          </Link>
        </div>
      </div>
    </div>
  )
}
