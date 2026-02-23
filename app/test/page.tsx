'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { saveTestAttempt } from '@/lib/api/test'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import questions from '../../data/questions.json'
import funfacts from '../../data/funfacts.json'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface FunFact {
  id: number
  fact: string
  emoji: string
}

export default function Test() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [testQuestions, setTestQuestions] = useState<Question[]>([])
  const [testComplete, setTestComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(2700)
  const [testStarted, setTestStarted] = useState(false)
  const [showFunFact, setShowFunFact] = useState(false)
  const [currentFunFact, setCurrentFunFact] = useState<FunFact | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [savingResults, setSavingResults] = useState(false)

  const getRandomFunFact = (): FunFact => {
    return funfacts.funFacts[Math.floor(Math.random() * funfacts.funFacts.length)]
  }

  const startTest = () => {
    const shuffled = [...questions.questions].sort(() => Math.random() - 0.5).slice(0, 20)
    setTestQuestions(shuffled)
    setCurrentQuestion(shuffled[0])
    setCurrentIndex(0)
    setTestStarted(true)
    setTimeLeft(2700)
    setSelectedAnswers([])
    setScore(0)
    setAnswered(0)
  }

  useEffect(() => {
    if (!testStarted || testComplete) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setTestComplete(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [testStarted, testComplete])

  const formatTime = useMemo(() => (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [])

  const selectAnswer = (index: number) => {
    if (showResult || showFunFact) return
    setSelectedAnswer(index)
    
    // Track all answers
    const newAnswers = [...selectedAnswers]
    newAnswers[currentIndex] = index
    setSelectedAnswers(newAnswers)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
    if (selectedAnswer === currentQuestion?.correct) {
      setScore(s => s + 1)
    }
    setAnswered(a => a + 1)
  }

  const nextQuestion = () => {
    if (currentIndex >= 19) {
      setTestComplete(true)
      return
    }
    
    if (Math.random() < 0.3) {
      setCurrentFunFact(getRandomFunFact())
      setShowFunFact(true)
      setShowResult(false)
      setSelectedAnswer(null)
    } else {
      const next = currentIndex + 1
      setCurrentIndex(next)
      setCurrentQuestion(testQuestions[next])
      setSelectedAnswer(null)
      setShowResult(false)
      setShowFunFact(false)
    }
  }

  const continueFromFunFact = () => {
    setShowFunFact(false)
    const next = currentIndex + 1
    setCurrentIndex(next)
    setCurrentQuestion(testQuestions[next])
    setSelectedAnswer(null)
    setShowResult(false)
  }

  // Save test results when complete
  useEffect(() => {
    const saveResults = async () => {
      if (testComplete && user && !savingResults) {
        setSavingResults(true)
        try {
          const timeSpent = 2700 - timeLeft
          const percentage = (score / 20) * 100
          
          const answersData = testQuestions.map((q, index) => ({
            questionId: q.id,
            selectedAnswer: selectedAnswers[index] ?? null,
            isCorrect: selectedAnswers[index] === q.correct
          }))

          await saveTestAttempt({
            score: score,
            totalQuestions: 20,
            percentage: percentage,
            timeSpentSeconds: timeSpent,
            answers: answersData
          })
          
          toast.success('Results saved to your dashboard!')
        } catch (error) {
          console.error('Failed to save results:', error)
          // Don't show error to user, test still worked
        }
      }
    }
    
    saveResults()
  }, [testComplete, user])

  const restart = () => {
    setScore(0)
    setAnswered(0)
    setTestComplete(false)
    setTestStarted(false)
    setTimeLeft(2700)
    setShowFunFact(false)
    setSelectedAnswers([])
    setSavingResults(false)
  }

  const percentage = (score / 20) * 100

  if (!testStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto text-center py-10 md:py-20">
          <div className="text-5xl md:text-6xl mb-6">🇦🇺</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Practice Test</h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8">
            20 questions • 45 minutes • 75% to pass
          </p>
          
          {!user && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Sign up</strong> to track your progress and see your improvement over time!
              </p>
              <Link
                href="/signup"
                className="inline-block mt-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          )}
          
          <div className="card text-left mb-8 bg-white/80 backdrop-blur">
            <h3 className="font-semibold text-lg mb-4">Before you begin:</h3>
            <ul className="space-y-3 text-gray-600 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                You have 45 minutes to complete 20 questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                You need 15 correct answers (75%) to pass
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                Questions are randomly selected from all topics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                After each question, you'll see the correct answer
              </li>
              {user && (
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  Your results will be saved to your dashboard
                </li>
              )}
            </ul>
          </div>

          <button onClick={startTest} className="btn btn-primary text-lg">
            Start Practice Test →
          </button>

          <div className="mt-8">
            <Link href="/study" className="text-green-600 hover:text-green-700">
              Or study by topic →
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (testComplete) {
    const passed = score >= 15
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto text-center py-10 md:py-20">
          <div className="text-6xl md:text-8xl mb-6">{passed ? '🎉' : '📚'}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            You scored {score}/20 ({Math.round(score/20*100)}%)
          </p>
          <div className={`card mb-8 ${passed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className={`text-lg md:text-xl font-semibold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {passed ? '✅ You passed! You\'re ready for the real test.' : '❌ You need 15/20 to pass. Keep studying!'}
            </p>
          </div>
          
          {user && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Your results have been saved to your dashboard!
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={restart} className="btn btn-primary">
              🔄 Take Another Test
            </button>
            
            {user && (
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-secondary"
              >
                📊 View Dashboard
              </button>
            )}
            
            <a href="/" className="btn btn-secondary text-center">
              Back to Home
            </a>
          </div>
          
          {!user && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <p className="text-lg font-semibold mb-2">🎯 Track Your Progress</p>
              <p className="text-gray-600 mb-4">
                Sign up to save your results, track your improvement, and get personalized study recommendations.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 md:pb-8">
      {/* Fixed Header with Timer */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold text-green-600">🇦🇺</div>
          <div className="flex items-center gap-4 md:gap-8">
            <div className="text-center">
              <p className="text-xs text-gray-500">Question</p>
              <p className="font-bold text-sm md:text-base">{currentIndex + 1}/20</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Score</p>
              <p className="font-bold text-green-600 text-sm md:text-base">{score}/{answered}</p>
            </div>
            <div className="text-center min-w-[60px]">
              <p className="text-xs text-gray-500">Time</p>
              <p className={`font-bold text-sm md:text-base font-mono ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar - Fixed below header */}
      <div className="fixed top-[60px] left-0 right-0 h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / 20) * 100}%` }}
        />
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-24" />

      {/* Fun Fact Display */}
      {showFunFact && currentFunFact && (
        <div className="max-w-3xl mx-auto py-8 px-4 md:px-6">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 md:p-8 text-center">
            <div className="text-5xl md:text-6xl mb-4">{currentFunFact.emoji}</div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">🦘 Fun Fact About Australia</p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">{currentFunFact.fact}</p>
            <button 
              onClick={continueFromFunFact}
              className="btn btn-primary w-full sm:w-auto"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Question */}
      {!showFunFact && currentQuestion && (
        <div className="max-w-3xl mx-auto py-8 px-4 md:px-6">
          <div className="mb-4">
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">{currentQuestion.question}</h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let bgClass = 'bg-white hover:bg-gray-50 border-gray-200'
              if (showResult) {
                if (index === currentQuestion.correct) {
                  bgClass = 'bg-green-50 border-green-500 border-2'
                } else if (index === selectedAnswer && index !== currentQuestion.correct) {
                  bgClass = 'bg-red-50 border-red-500 border-2'
                }
              } else if (selectedAnswer === index) {
                bgClass = 'bg-green-50 border-green-500 border-2'
              }
              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all text-sm md:text-base ${bgClass}`}
                  disabled={showResult}
                >
                  <span className="font-medium mr-2 md:mr-3">{['A', 'B', 'C', 'D'][index]}.</span>
                  {option}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="font-semibold text-blue-800 mb-2 text-sm md:text-base">💡 Explanation:</p>
              <p className="text-blue-700 text-sm md:text-base">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 md:mt-8 flex gap-4 sticky bottom-4 md:static md:bottom-auto">
            {!showResult ? (
              <button 
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed py-3 md:py-2 text-sm md:text-base shadow-lg md:shadow-none"
              >
                Submit Answer
              </button>
            ) : (
              <button 
                onClick={nextQuestion}
                className="btn btn-primary flex-1 py-3 md:py-2 text-sm md:text-base shadow-lg md:shadow-none"
              >
                {currentIndex >= 19 ? 'See Results' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
