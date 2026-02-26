'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { funFacts } from '@/data/funFacts'

export default function HomePage() {
  const { user } = useAuth()
  const [randomFact, setRandomFact] = useState(funFacts[0])

  useEffect(() => {
    // Pick a random fun fact on load
    const randomIndex = Math.floor(Math.random() * funFacts.length)
    setRandomFact(funFacts[randomIndex])
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🇦🇺</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Australian Citizenship Practice Test
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Prepare for your citizenship test with 250 practice questions based on "Our Common Bond"
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/test"
                className="bg-white text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-xl transition-colors text-lg"
              >
                Take Practice Test
              </Link>
              <Link
                href="/study"
                className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-xl transition-colors text-lg border-2 border-white/30"
              >
                Study Questions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Fact Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Did You Know?</h2>
                <p className="text-gray-700 text-lg">{randomFact.fact}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Practice With Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">250 Practice Questions</h3>
              <p className="text-gray-600">All questions based on the official "Our Common Bond" resource</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold mb-2">Real Test Format</h3>
              <p className="text-gray-600">Practice with the same format and timing as the real citizenship test</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your improvement with detailed statistics and history</p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">About the Citizenship Test</h2>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <strong>20 multiple choice questions</strong>
                  <p className="text-gray-600 text-sm">45 minutes to complete</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <strong>75% pass mark (15/20)</strong>
                  <p className="text-gray-600 text-sm">Plus 100% on Australian values questions</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <strong>5 Australian values questions</strong>
                  <p className="text-gray-600 text-sm">All 5 must be answered correctly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <strong>Based on "Our Common Bond"</strong>
                  <p className="text-gray-600 text-sm">The official study resource</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Practicing?</h2>
          <p className="text-green-100 mb-8">
            Sign up to track your progress and improve your chances of passing the citizenship test.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Sign Up Free
              </Link>
              <Link
                href="/login"
                className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-xl transition-colors border-2 border-white/30"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="bg-white text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-xl transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">
            This is a practice tool and does not guarantee passing the official test.
          </p>
          <p className="text-sm">
            Study from the official resource: "Our Common Bond" — Department of Home Affairs
          </p>
        </div>
      </footer>
    </div>
  )
}
