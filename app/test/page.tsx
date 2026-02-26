'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthProvider'
import questions from '@/data/questions.json'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export default function TestPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [testQuestions, setTestQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(45 * 60)
  const [saving, setSaving] = useState(false)
  const [resultSaved, setResultSaved] = useState(false)

  useEffect(() => {
    if (!testStarted || showResult) return
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testStarted, showResult])

  const startTest = () => {
    // Get 5 Australian values questions
    const australianValuesQuestions = questions.questions.filter(
      (q: Question) => q.category === 'Australian values'
    )
    
    const shuffledValues = australianValuesQuestions.sort(() => Math.random() - 0.5)
    const selectedValues = shuffledValues.slice(0, 5)
    
    // Get 15 questions from other categories
    const otherQuestions = questions.questions.filter(
      (q: Question) => q.category !== 'Australian values'
    )
    const shuffledOther = otherQuestions.sort(() => Math.random() - 0.5)
    const selectedOther = shuffledOther.slice(0, 15)
    
    const combined = [...selectedValues, ...selectedOther].sort(() => Math.random() - 0.5)
    
    setTestQuestions(combined)
    setSelectedAnswers(new Array(20).fill(-1))
    setTestStarted(true)
    setCurrentQuestion(0)
    setShowResult(false)
    setResultSaved(false)
    setTimeRemaining(45 * 60)
  }

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index)
  }

  const finishTest = async () => {
    if (showResult) return
    
    setSaving(true)
    
    // Calculate scores
    let correctCount = 0
    let valuesCorrect = 0
    let valuesTotal = 0
    
    testQuestions.forEach((question, index) => {
      const isCorrect = selectedAnswers[index] === question.correct
      if (isCorrect) correctCount++
      
      if (question.category === 'Australian values') {
        valuesTotal++
        if (isCorrect) valuesCorrect++
      }
    })

    const passed = valuesCorrect === 5 && correctCount >= 15

    // Save test result to database
    if (user) {
      try {
        const response = await fetch('/api/test-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: correctCount,
            total_questions: 20,
            values_score: valuesCorrect,
            values_total: valuesTotal,
            passed,
            answers: testQuestions.map((q, idx) => ({
              question_id: q.id,
              selected_answer: selectedAnswers[idx],
              correct: selectedAnswers[idx] === q.correct,
              is_values_question: q.category === 'Australian values'
            }))
          })
        })

        if (response.ok) {
          setResultSaved(true)
          toast.success('Test results saved!')
        } else {
          const error = await response.json()
          console.error('Failed to save test result:', error)
          toast.error('Failed to save results')
        }
      } catch (error) {
        console.error('Error saving test result:', error)
        toast.error('Error saving results')
      }
    }

    setShowResult(true)
    setSaving(false)
    
    if (passed) {
      toast.success('Congratulations! You passed the practice test!')
    } else if (valuesCorrect < 5) {
      toast.error(`You need all 5 Australian values questions correct. You got ${valuesCorrect}/5.`)
    } else {
      toast.error(`You need 15/20 to pass. You got ${correctCount}/20.`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🇦🇺 Practice Citizenship Test</h1>
            <p className="text-gray-600">Test your knowledge with 20 questions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Test Information</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <strong>20 multiple choice questions</strong>
                  <p className="text-sm text-gray-500">From a pool of 250 questions based on "Our Common Bond"</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <strong>45 minutes time limit</strong>
                  <p className="text-sm text-gray-500">Plenty of time to read each question carefully</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <strong>Passing requirements:</strong>
                  <ul className="text-sm text-gray-500 mt-1 list-disc list-inside">
                    <li>5/5 (100%) on Australian values questions</li>
                    <li>At least 15/20 (75%) overall</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <button
            onClick={startTest}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            Start Practice Test
          </button>

          {!user && (
            <p className="text-center text-gray-500 mt-4 text-sm">
              💡 <Link href="/login" className="text-green-600 hover:underline">Sign in</Link> to save your test results
            </p>
          )}
        </div>
      </div>
    )
  }

  if (showResult) {
    const correctCount = testQuestions.filter((q, idx) => selectedAnswers[idx] === q.correct).length
    const valuesQuestions = testQuestions.filter(q => q.category === 'Australian values')
    const valuesCorrect = valuesQuestions.filter((q, idx) => selectedAnswers[idx] === q.correct).length
    const passed = valuesCorrect === 5 && correctCount >= 15

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{passed ? '🎉' : '📚'}</div>
            <h1 className="text-4xl font-bold mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-600 text-lg">
              {passed ? 'You passed the practice test!' : 'Review your answers and try again'}
            </p>
            {resultSaved && (
              <p className="text-green-600 text-sm mt-2">✓ Results saved to your dashboard</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-5xl font-bold text-gray-900 mb-2">{correctCount}/20</div>
                <div className="text-gray-600">Overall Score</div>
                <div className="text-sm text-gray-500 mt-1">{Math.round((correctCount/20)*100)}%</div>
              </div>
              
              <div className={`text-center p-6 rounded-xl ${valuesCorrect === 5 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-5xl font-bold mb-2 ${valuesCorrect === 5 ? 'text-green-600' : 'text-red-600'}`}>
                  {valuesCorrect}/5
                </div>
                <div className="text-gray-600">Australian Values</div>
                <div className="text-sm text-gray-500 mt-1">Required: 5/5 (100%)</div>
              </div>
              
              <div className={`text-center p-6 rounded-xl ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className={`text-5xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                  {passed ? '✓' : '✗'}
                </div>
                <div className="text-gray-600">Result</div>
                <div className="text-sm text-gray-500 mt-1">{passed ? 'PASSED' : 'NOT PASSED'}</div>
              </div>
            </div>

            {!passed && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-yellow-900">Requirements to pass:</p>
                    <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
                      {valuesCorrect < 5 && <li>Get all 5 Australian values questions correct (you got {valuesCorrect}/5)</li>}
                      {correctCount < 15 && <li>Score at least 15/20 overall (you got {correctCount}/20)</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Review Your Answers</h2>
            <div className="space-y-4">
              {testQuestions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correct
                const isValuesQuestion = question.category === 'Australian values'
                
                return (
                  <div 
                    key={question.id} 
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{question.question}</p>
                          {isValuesQuestion && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              Australian Values
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Your answer: {question.options[selectedAnswers[index]] || 'Not answered'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-700 mt-1">
                            Correct answer: {question.options[question.correct]}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-2 italic">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startTest}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/study"
              className="flex-1 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-4 px-6 rounded-xl transition-colors text-center"
            >
              Study More
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const question = testQuestions[currentQuestion]
  const isValuesQuestion = question?.category === 'Australian values'

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Question {currentQuestion + 1} of 20</span>
            <div className="flex items-center gap-4">
              {isValuesQuestion && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  Australian Values
                </span>
              )}
              <span className={`text-sm font-medium ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                ⏱️ {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => goToQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </button>
          
          {currentQuestion === 19 ? (
            <button
              onClick={finishTest}
              disabled={saving || selectedAnswers.includes(-1)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-semibold"
            >
              {saving ? 'Saving...' : 'Finish Test'}
            </button>
          ) : (
            <button
              onClick={() => goToQuestion(currentQuestion + 1)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next →
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-10 gap-2">
            {testQuestions.map((q, index) => {
              const isValues = q.category === 'Australian values'
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentQuestion === index
                      ? 'bg-green-600 text-white'
                      : selectedAnswers[index] !== -1
                        ? isValues 
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                          : 'bg-green-100 text-green-700'
                        : isValues
                          ? 'bg-purple-50 text-gray-400 border-2 border-purple-200'
                          : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
