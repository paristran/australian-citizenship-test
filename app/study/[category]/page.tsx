'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import questions from '../../../data/questions.json'

export default function StudyCategory() {
  const params = useParams()
  const router = useRouter()
  const category = decodeURIComponent(params.category as string)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)

  // Filter questions by category
  const categoryQuestions = useMemo(() => {
    return questions.questions.filter(q => q.category === category)
  }, [category])

  const currentQuestion = categoryQuestions[currentIndex]

  const categoryInfo: Record<string, { emoji: string; color: string }> = {
    'Australia and its people': { emoji: '🇦🇺', color: 'from-green-500 to-green-600' },
    'Democratic beliefs': { emoji: '🗳️', color: 'from-blue-500 to-blue-600' },
    'Government and the law': { emoji: '⚖️', color: 'from-purple-500 to-purple-600' },
    'Australian values': { emoji: '🤝', color: 'from-orange-500 to-orange-600' },
    'Rights and responsibilities': { emoji: '📋', color: 'from-red-500 to-red-600' }
  }

  const info = categoryInfo[category] || { emoji: '📚', color: 'from-gray-500 to-gray-600' }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">No questions found</h1>
          <p className="text-gray-600 mb-6">This category doesn't have any questions yet.</p>
          <Link href="/study" className="text-green-600 hover:text-green-700 font-semibold">
            ← Back to Study Topics
          </Link>
        </div>
      </div>
    )
  }

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    
    setShowExplanation(true)
    setAnsweredCount(prev => prev + 1)
    
    if (selectedAnswer === currentQuestion.correct) {
      setCorrectCount(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < categoryQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCorrectCount(0)
    setAnsweredCount(0)
  }

  const progress = ((currentIndex + 1) / categoryQuestions.length) * 100

  // Keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key >= '1' && e.key <= '4' && !showExplanation) {
      const index = parseInt(e.key) - 1
      if (index < currentQuestion.options.length) {
        setSelectedAnswer(index)
      }
    } else if (e.key === 'Enter') {
      if (!showExplanation && selectedAnswer !== null) {
        handleSubmit()
      } else if (showExplanation) {
        if (currentIndex < categoryQuestions.length - 1) {
          handleNext()
        }
      }
    }
  }

  // Add keyboard listener
  useState(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress as any)
      return () => window.removeEventListener('keydown', handleKeyPress as any)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className={`bg-gradient-to-r ${info.color} text-white py-6 px-4 shadow-lg sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/study"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Topics
            </Link>
            <div className="text-sm opacity-95">
              {info.emoji} {category}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Question {currentIndex + 1} of {categoryQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <span>✓ Correct: {correctCount}/{answeredCount}</span>
            {answeredCount > 0 && (
              <span>Accuracy: {Math.round((correctCount / answeredCount) * 100)}%</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">
              {category}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              let buttonStyle = 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
              
              if (showExplanation) {
                if (index === currentQuestion.correct) {
                  buttonStyle = 'bg-green-50 border-2 border-green-500 text-green-900'
                } else if (index === selectedAnswer && index !== currentQuestion.correct) {
                  buttonStyle = 'bg-red-50 border-2 border-red-500 text-red-900'
                }
              } else if (selectedAnswer === index) {
                buttonStyle = 'bg-blue-50 border-2 border-blue-500 text-blue-900'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl transition-all ${buttonStyle} ${
                    !showExplanation && 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center font-bold text-sm">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 pt-1">{option}</span>
                    {showExplanation && index === currentQuestion.correct && (
                      <span className="text-green-600 text-xl">✓</span>
                    )}
                    {showExplanation && index === selectedAnswer && index !== currentQuestion.correct && (
                      <span className="text-red-600 text-xl">✗</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Submit Button */}
          {!showExplanation && (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                selectedAnswer !== null
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-6 rounded-xl ${
              selectedAnswer === currentQuestion.correct
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-blue-50 border-2 border-blue-200'
            }`}>
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">
                  {selectedAnswer === currentQuestion.correct ? '🎉' : '💡'}
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    {selectedAnswer === currentQuestion.correct ? 'Correct!' : 'Not quite right'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
              currentIndex > 0
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>
          
          {currentIndex < categoryQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all"
            >
              🔄 Start Over
            </button>
          )}
        </div>

        {/* Completion Card */}
        {currentIndex === categoryQuestions.length - 1 && showExplanation && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold mb-2">Great Work!</h3>
            <p className="text-gray-600 mb-4">
              You've completed all {categoryQuestions.length} questions in this category.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round((correctCount / answeredCount) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRestart}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Study Again
              </button>
              <Link
                href="/study"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
              >
                Choose Another Topic
              </Link>
              <Link
                href="/test"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
              >
                Take Practice Test
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Keyboard Shortcuts Info */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs text-gray-600 hidden md:block">
        <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
        <div>1-4: Select answer</div>
        <div>Enter: Check/Next</div>
      </div>
    </div>
  )
}
