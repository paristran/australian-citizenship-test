import type { Metadata } from 'next'
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

  const categoryInfo: Record<string, { emoji: string; description: string; topics: string[] }> = {
    'Australia and its people': {
      emoji: '🇦🇺',
      description: 'Learn about Australia\'s history, Indigenous peoples, and national symbols.',
      topics: ['First inhabitants', 'European settlement', 'Federation', 'National symbols', 'Geography']
    },
    'Democratic beliefs': {
      emoji: '🗳️',
      description: 'Understand Australia\'s democratic system, freedoms, and values.',
      topics: ['Parliamentary democracy', 'Rule of law', 'Freedoms', 'Values', 'Voting']
    },
    'Government and the law': {
      emoji: '⚖️',
      description: 'Learn about Australia\'s government structure and legal system.',
      topics: ['Constitution', 'Parliament', 'Three levels of government', 'Courts', 'Elections']
    },
    'Australian values': {
      emoji: '🤝',
      description: 'Understand the values that shape Australian society.',
      topics: ['Fair go', 'Mateship', 'Equality', 'Multiculturalism', 'Respect']
    },
    'Rights and responsibilities': {
      emoji: '📋',
      description: 'Know your rights and responsibilities as an Australian citizen.',
      topics: ['Voting', 'Taxation', 'Jury service', 'Defence', 'Community participation']
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">📚 Study Mode</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Learn about Australian citizenship topics. Study by category to master each area.
          </p>
        </div>
      </header>

      {/* Quick Tips */}
      <section className="py-12 px-4 bg-yellow-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">💡 Quick Study Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-2">📖 Read the Booklet</h3>
              <p className="text-sm text-gray-600">Download and read &quot;Our Common Bond&quot; from the official government website.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-2">🔄 Practice Regularly</h3>
              <p className="text-sm text-gray-600">Take practice tests multiple times to reinforce your knowledge.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold mb-2">📝 Focus on Weak Areas</h3>
              <p className="text-sm text-gray-600">Spend extra time on categories where you score lowest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Topic Categories</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(categories).map(([category, qs]) => {
              const info = categoryInfo[category] || { emoji: '📚', description: '', topics: [] }
              return (
                <div key={category} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{info.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{category}</h3>
                      <p className="text-gray-600 text-sm mb-3">{info.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {info.topics.map(topic => (
                          <span key={topic} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {qs.length} questions available
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">🔑 Key Facts to Remember</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-600">Important Dates</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded">26 Jan 1788</span>
                  <span className="text-gray-700">First Fleet arrives</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded">1 Jan 1901</span>
                  <span className="text-gray-700">Federation of Australia</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded">25 April</span>
                  <span className="text-gray-700">ANZAC Day</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-sm bg-white px-2 py-1 rounded">11 November</span>
                  <span className="text-gray-700">Remembrance Day</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Government Structure</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ <strong>Federal:</strong> Defence, immigration, currency</li>
                <li>✓ <strong>State:</strong> Schools, hospitals, police</li>
                <li>✓ <strong>Local:</strong> Rubbish, parks, local roads</li>
                <li>✓ <strong>Voting:</strong> Compulsory for citizens 18+</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-600">National Symbols</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ <strong>Anthem:</strong> Advance Australia Fair</li>
                <li>✓ <strong>Colors:</strong> Green and gold</li>
                <li>✓ <strong>Floral:</strong> Golden wattle</li>
                <li>✓ <strong>Gemstone:</strong> Opal</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-600">Test Details</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ <strong>Questions:</strong> 20 randomly selected</li>
                <li>✓ <strong>Time:</strong> 45 minutes</li>
                <li>✓ <strong>Pass mark:</strong> 75% (15/20)</li>
                <li>✓ <strong>Resource:</strong> &quot;Our Common Bond&quot;</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-green-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
        <p className="text-lg mb-8 opacity-90">Take a practice test to see how much you&apos;ve learned!</p>
        <a href="/test" className="inline-block bg-white text-green-600 font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors">
          Start Practice Test →
        </a>
      </section>
    </main>
  )
}
