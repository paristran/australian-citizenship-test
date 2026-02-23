import type { Metadata } from 'next'
import Link from 'next/link'
import questions from '../../data/questions.json'

export const metadata: Metadata = {
  title: 'Study Mode | Australian Citizenship Practice',
  description: 'Study Australian citizenship topics including history, government, values, and symbols. Based on "Our Common Bond" official resource.',
}

export default function Study() {
  // Group questions by category
  const categories = questions.questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = []
    acc[q.category].push(q)
    return acc
  }, {} as Record<string, typeof questions.questions>)

  const categoryInfo: Record<string, { emoji: string; description: string; color: string }> = {
    'Australia and its people': {
      emoji: '🇦🇺',
      description: 'Learn about Australia\'s history, Indigenous peoples, and national symbols.',
      color: 'from-green-500 to-green-600'
    },
    'Democratic beliefs': {
      emoji: '🗳️',
      description: 'Understand Australia\'s democratic system, freedoms, and values.',
      color: 'from-blue-500 to-blue-600'
    },
    'Government and the law': {
      emoji: '⚖️',
      description: 'Learn about Australia\'s government structure and legal system.',
      color: 'from-purple-500 to-purple-600'
    },
    'Australian values': {
      emoji: '🤝',
      description: 'Understand the values that shape Australian society.',
      color: 'from-orange-500 to-orange-600'
    },
    'Rights and responsibilities': {
      emoji: '📋',
      description: 'Know your rights and responsibilities as an Australian citizen.',
      color: 'from-red-500 to-red-600'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Mode</h1>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto">
            Master each topic with instant feedback. Click a category to start studying.
          </p>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="bg-white border-b py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600">{questions.questions.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">{Object.keys(categories).length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-600">Based on Official Guide</div>
          </div>
        </div>
      </section>

      {/* Categories - Clickable */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Choose a Topic to Study</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categories).map(([category, qs]) => {
              const info = categoryInfo[category] || { emoji: '📚', description: '', color: 'from-gray-500 to-gray-600' }
              
              return (
                <Link
                  key={category}
                  href={`/study/${encodeURIComponent(category)}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-green-500 h-full">
                    {/* Gradient Header */}
                    <div className={`bg-gradient-to-r ${info.color} p-6 text-white`}>
                      <div className="text-5xl mb-3">{info.emoji}</div>
                      <h3 className="text-xl font-bold">{category}</h3>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {info.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">
                          {qs.length} questions
                        </span>
                        <span className="text-green-600 font-semibold group-hover:translate-x-1 transition-transform">
                          Start →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How Study Mode Works</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">Choose Topic</h3>
              <p className="text-gray-600 text-sm">Select a category you want to study</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">Answer Questions</h3>
              <p className="text-gray-600 text-sm">Read each question and select your answer</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">Instant Feedback</h3>
              <p className="text-gray-600 text-sm">See correct answer and explanation immediately</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-bold mb-2">Learn & Improve</h3>
              <p className="text-gray-600 text-sm">Master each topic at your own pace</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts Quick Reference */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">🔑 Quick Reference Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-700 flex items-center gap-2">
                <span className="text-2xl">📅</span> Important Dates
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-700">
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded shadow-sm">26 Jan 1788</span>
                  <span>First Fleet arrives</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded shadow-sm">1 Jan 1901</span>
                  <span>Federation of Australia</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded shadow-sm">25 April</span>
                  <span>ANZAC Day</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="font-mono text-sm bg-white px-3 py-1 rounded shadow-sm">11 Nov</span>
                  <span>Remembrance Day</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-purple-700 flex items-center gap-2">
                <span className="text-2xl">🏛️</span> Government Levels
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600">Federal:</span>
                  <span>Defence, immigration, currency, trade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600">State:</span>
                  <span>Schools, hospitals, police, roads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-purple-600">Local:</span>
                  <span>Rubbish, parks, local roads, building permits</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
                <span className="text-2xl">🎵</span> National Symbols
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ <strong>Anthem:</strong> Advance Australia Fair</li>
                <li>✓ <strong>Colors:</strong> Green and gold</li>
                <li>✓ <strong>Floral:</strong> Golden wattle</li>
                <li>✓ <strong>Animal:</strong> Kangaroo & Emu</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <span className="text-2xl">📝</span> Test Information
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ <strong>Questions:</strong> 20 random</li>
                <li>✓ <strong>Time:</strong> 45 minutes</li>
                <li>✓ <strong>Pass mark:</strong> 75% (15/20)</li>
                <li>✓ <strong>Resource:</strong> "Our Common Bond"</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
        <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
          After studying, take a timed practice test to simulate the real exam experience!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/test"
            className="inline-block bg-white text-green-600 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            🎯 Start Practice Test
          </Link>
          <a
            href="https://immi.homeaffairs.gov.au/citizenship-subsite/files/our-common-bond.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-green-600 transition-colors"
          >
            📖 Download "Our Common Bond"
          </a>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 px-4 bg-gray-100 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>
            💡 <strong>Pro Tip:</strong> Study each category thoroughly before taking practice tests. 
            Focus on understanding the explanations, not just memorizing answers.
          </p>
        </div>
      </section>
    </main>
  )
}
