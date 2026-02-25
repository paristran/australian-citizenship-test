'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthProvider'
import Link from 'next/link'
import questions from '@/data/questions.json'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export default function CategoryStudyPage() {
  const params = useParams()
  const { user } = useAuth()
  const categorySlug = params.category as string
  
  // Map URL slug to category name
  const categoryMap: Record<string, string> = {
    'australia-and-its-people': 'Australia and its people',
    'government-and-law': 'Government and law',
    'democratic-beliefs': 'Democratic beliefs',
    'australian-values': 'Australian values',
  }
  
  const categoryName = categoryMap[categorySlug] || categorySlug
  
  // Filter questions by category
  const categoryQuestions = questions.questions.filter(
    (q: Question) => q.category === categoryName
  )
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [progressRecorded, setProgressRecorded] = useState(false)

  const currentQuestion = categoryQuestions[currentIndex]

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    setProgressRecorded(false)
  }, [currentIndex])

  // Record progress to API when user answers
  const recordProgress = async (questionId: number, category: string, isCorrect: boolean) => {
    if (!user || progressRecorded) return
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          category: category,
          is_correct: isCorrect
        })
      })
      
      if (response.ok) {
        setProgressRecorded(true)
        console.log('Progress recorded:', questionId, isCorrect)
      }
    } catch (error) {
      console.error('Failed to record progress:', error)
    }
  }

  const checkAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return
    
    setShowExplanation(true)
    setAnsweredCount(prev => prev + 1)
    
    const isCorrect = selectedAnswer === currentQuestion.correct
    if (isCorrect) {
      setCorrectCount(prev => prev + 1)
    }
    
    // Record progress to API
    recordProgress(currentQuestion.id, currentQuestion.category, isCorrect)
  }

  const nextQuestion = () => {
    if (currentIndex < categoryQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link href="/study" className="text-green-600 hover:underline">
            ← Back to Study
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/study" className="text-green-600 hover:text-green-700 mb-2 inline-block">
            ← Back to Study
          </Link>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-gray-600 mt-1">
            Question {currentIndex + 1} of {categoryQuestions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{correctCount}/{answeredCount} correct</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / categoryQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => !showExplanation && setSelectedAnswer(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  showExplanation
                    ? index === currentQuestion.correct
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === index
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                    : selectedAnswer === index
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correct 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className="font-semibold mb-2">
                {selectedAnswer === currentQuestion.correct ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Check Answer Button */}
          {!showExplanation && (
            <button
              onClick={checkAnswer}
              disabled={selectedAnswer === null}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </button>
          
          {showExplanation && currentIndex < categoryQuestions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
