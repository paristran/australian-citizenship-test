'use client'

import { useState } from 'react'
import questions from '../../data/questions.json'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

const categories = ['All', ...Array.from(new Set(questions.questions.map(q => q.category)))]

export default function Study() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const filtered = selectedCategory === 'All' 
    ? questions.questions 
    : questions.questions.filter(q => q.category === selectedCategory)

  const currentQuestion = filtered[currentIndex] as Question

  const next = () => {
    setShowAnswer(false)
    setCurrentIndex(i => Math.min(i + 1, filtered.length - 1))
  }

  const prev = () => {
    setShowAnswer(false)
    setCurrentIndex(i => Math.max(i - 1, 0))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-600">🇦🇺 Citizenship Test</a>
          <span className="text-gray-500">Study Mode</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); setShowAnswer(false) }}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === cat 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat} ({cat === 'All' ? questions.questions.length : questions.questions.filter(q => q.category === cat).length})
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <p className="text-gray-500">
            Question {currentIndex + 1} of {filtered.length}
          </p>
          <div className="h-2 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card">
          <div className="mb-4">
            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {currentQuestion?.category}
            </span>
          </div>
          
          <h2 className="text-2xl font-semibold mb-8">{currentQuestion?.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion?.options.map((option, index) => {
              let bgClass = 'bg-gray-50 border-gray-200'
              if (showAnswer) {
                bgClass = index === currentQuestion.correct
                  ? 'bg-green-100 border-green-500'
                  : 'bg-gray-50 border-gray-200'
              }
              return (
                <div
                  key={index}
                  className={`p-5 rounded-xl border-2 ${bgClass}`}
                >
                  <span className="font-medium mr-3">{['A', 'B', 'C', 'D'][index]}.</span>
                  {option}
                  {showAnswer && index === currentQuestion.correct && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Show Answer Button */}
          {!showAnswer ? (
            <button 
              onClick={() => setShowAnswer(true)}
              className="btn btn-primary w-full"
            >
              Show Answer
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-semibold text-blue-800 mb-2">💡 Explanation:</p>
                <p className="text-blue-700">{currentQuestion?.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          <button 
            onClick={prev}
            disabled={currentIndex === 0}
            className="btn btn-secondary flex-1 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button 
            onClick={next}
            disabled={currentIndex === filtered.length - 1}
            className="btn btn-primary flex-1 disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          {categories.slice(1).map(cat => {
            const count = questions.questions.filter(q => q.category === cat).length
            return (
              <div key={cat} className="card text-center">
                <p className="text-3xl font-bold text-green-600">{count}</p>
                <p className="text-gray-500 text-sm">{cat}</p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
