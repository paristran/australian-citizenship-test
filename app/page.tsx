import Link from 'next/link'
import funfacts from '../../data/funfacts.json'

// Get 6 random fun facts for the landing page
const getRandomFacts = (count: number) => {
  const shuffled = [...funfacts.funFacts].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function Home() {
  const featuredFacts = getRandomFacts(6)

  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-green-50 via-white to-amber-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-7xl mb-8 animate-bounce">🇦🇺</div>
          <h1 className="mb-6">
            <span className="gradient-text">Australian</span><br/>
            <span className="text-gray-300">Citizenship Test</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Prepare with confidence. 100+ practice questions based on &quot;Our Common Bond&quot; — the official test resource.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link href="/test" className="btn btn-primary text-lg px-10 py-5">
              🎯 Start Practice Test
            </Link>
            <Link href="/study" className="btn btn-secondary text-lg px-10 py-5">
              📚 Study Mode
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex gap-8 justify-center text-gray-400 text-sm">
            <span>✅ 100+ Questions</span>
            <span>⏱️ Real Test Format</span>
            <span>🎓 Explanations</span>
            <span>🦘 Fun Facts</span>
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-5xl mb-4 block">🦘</span>
            <h2 className="mb-4">Did You Know?</h2>
            <p className="text-gray-500 text-lg">Amazing facts about Australia you might not know</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFacts.map((fact) => (
              <div 
                key={fact.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-amber-100 hover:border-amber-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {fact.emoji}
                </div>
                <p className="text-gray-600 leading-relaxed">{fact.fact}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              🎉 You&apos;ll discover more fun facts during your practice test!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-16">Why Practice With Us?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="text-xl font-semibold mb-2">100+ Questions</h3>
              <p className="text-gray-500">Comprehensive coverage of all testable content from &quot;Our Common Bond&quot;</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-xl font-semibold mb-2">Test Simulation</h3>
              <p className="text-gray-500">Practice in real exam conditions — 20 questions, 45 minutes, 75% to pass</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                💡
              </div>
              <h3 className="text-xl font-semibold mb-2">Explanations</h3>
              <p className="text-gray-500">Learn why answers are correct with detailed explanations</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                🦘
              </div>
              <h3 className="text-xl font-semibold mb-2">Fun Facts</h3>
              <p className="text-gray-500">Discover amazing facts about Australia while you learn</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Test Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-12">About the Citizenship Test</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                <span className="text-2xl">📋</span> Test Format
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>20 multiple choice questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>45 minutes to complete</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Need 75% (15/20) to pass</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Questions from &quot;Our Common Bond&quot;</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                <span className="text-2xl">📚</span> Testable Content
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Australia and its people</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Democratic beliefs, rights and liberties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Government and the law</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span>Australian values</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6">Ready to Start?</h2>
          <p className="text-xl opacity-90 mb-10">
            Join thousands who have successfully prepared for their citizenship test.
          </p>
          <Link href="/test" className="btn bg-white text-green-600 hover:bg-gray-100 text-lg px-12 py-5">
            🎯 Begin Practice Test →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-4">🇦🇺</div>
          <p className="mb-4">Based on &quot;Our Common Bond&quot; — Official Australian citizenship test resource</p>
          <p className="text-sm text-gray-500">This is a practice tool and is not affiliated with the Australian Government</p>
          <div className="mt-8 pt-8 border-t border-gray-800 flex justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/test" className="hover:text-white transition">Practice Test</Link>
            <Link href="/study" className="hover:text-white transition">Study Mode</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
