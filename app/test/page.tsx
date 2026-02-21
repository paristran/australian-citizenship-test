'use client'

import { useState, useEffect } from 'react'
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const selectAnswer = (index: number) => {
    if (showResult || showFunFact) return
    setSelectedAnswer(index)
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
    
    // Show fun fact between some questions (30% chance)
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

  const restart = () => {
    setScore(0)
    setAnswered(0)
    setTestComplete(false)
    setTestStarted(false)
    setTimeLeft(2700)
    setShowFunFact(false)
  }

  if (!testStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">🇦🇺</div>
          <h1 className="mb-6">Practice Test</h1>
          <p className="text-xl text-gray-500 mb-8">
            20 questions • 45 minutes • 75% to pass
          </p>
          <div className="card text-left mb-8">
            <h3 className="font-semibold text-lg mb-4">Before you begin:</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• You have 45 minutes to complete 20 questions</li>
              <li>• You need 15 correct answers (75%) to pass</li>
              <li>• Questions are randomly selected from all topics</li>
              <li>• After each question, you'll see the correct answer</li>
              <li>• Enjoy fun facts about Australia during your test! 🎉</li>
            </ul>
          </div>
          <button onClick={startTest} className="btn btn-primary text-xl px-12">
            Start Test
          </button>
        </div>
      </main>
    )
  }

  if (testComplete) {
    const passed = score >= 15
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-8xl mb-6">{passed ? '🎉' : '📚'}</div>
          <h1 className="mb-4">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
          <p className="text-2xl text-gray-600 mb-8">
            You scored {score}/20 ({Math.round(score/20*100)}%)
          </p>
          <div className={`card mb-8 ${passed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className={`text-xl font-semibold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {passed ? '✅ You passed! You\'re ready for the real test.' : '❌ You need 15/20 to pass. Keep studying!'}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={restart} className="btn btn-primary">
              Try Again
            </button>
            <a href="/" className="btn btn-secondary">
              Back to Home
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-green-600">🇦🇺 Citizenship Test</div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">Question</p>
              <p className="font-bold">{currentIndex + 1}/20</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Score</p>
              <p className="font-bold text-green-600">{score}/{answered}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Time Left</p>
              <p className={`font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${((currentIndex + (showResult ? 1 : 0)) / 20) * 100}%` }}
        />
      </div>

      {/* Fun Fact Display */}
      {showFunFact && currentFunFact && (
        <div className="max-w-3xl mx-auto py-12 px-6">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{currentFunFact.emoji}</div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-3">🦘 Fun Fact About Australia</p>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">{currentFunFact.fact}</p>
            <button 
              onClick={continueFromFunFact}
              className="btn btn-primary"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Question */}
      {!showFunFact && (
        <div className="max-w-3xl mx-auto py-12 px-6">
          <div className="mb-4">
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {currentQuestion?.category}
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-8">{currentQuestion?.question}</h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => {
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
                  className={`w-full text-left p-5 rounded-xl border transition-all ${bgClass}`}
                  disabled={showResult}
                >
                  <span className="font-medium mr-3">{['A', 'B', 'C', 'D'][index]}.</span>
                  {option}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showResult && currentQuestion && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="font-semibold text-blue-800 mb-2">💡 Explanation:</p>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            {!showResult ? (
              <button 
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button 
                onClick={nextQuestion}
                className="btn btn-primary flex-1"
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
