import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Australian Citizenship Practice Test | Free Practice Questions',
  description: 'Prepare for your Australian citizenship test with 250+ free practice questions based on "Our Common Bond". Practice tests, study guides, and instant feedback. Pass your test with confidence!',
  keywords: ['Australian citizenship test', 'citizenship practice test', 'Our Common Bond', 'Australian citizenship questions', 'citizenship test 2025', 'Australian citizenship preparation'],
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative  py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl md:text-8xl mb-6 animate-bounce">🇦🇺</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Australian Citizenship<br/>
            <span className="text-green-600">Practice Test</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Prepare with confidence. 250+ practice questions based on &quot;Our Common Bond&quot; — the official test resource.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/test" className="btn btn-primary text-lg px-10 py-5">
              🎯 Start Practice Test
            </Link>
            <Link href="/study" className="btn btn-secondary text-lg px-10 py-5">
              📚 Study Mode
            </Link>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6 md:gap-8 justify-center text-gray-500 text-sm md:text-base">
            <span className="flex items-center gap-2">✅ 250+ Questions</span>
            <span className="flex items-center gap-2">⏱️ Real Test Format</span>
            <span className="flex items-center gap-2">🎓 Explanations</span>
            <span className="flex items-center gap-2">🦘 Fun Facts</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our Practice Tests?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-green-50">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3">Comprehensive Coverage</h3>
              <p className="text-gray-600">250+ questions covering all topics from &quot;Our Common Bond&quot; - history, government, values, and more.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-blue-50">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-3">Learn with Explanations</h3>
              <p className="text-gray-600">Every question includes detailed explanations to help you understand and remember.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-purple-50">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Real Test Format</h3>
              <p className="text-gray-600">Practice with the same 45-minute, 20-question format as the official test.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">Choose Your Mode</h3>
              <p className="text-gray-600 text-sm">Practice Test or Study Mode</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">Answer Questions</h3>
              <p className="text-gray-600 text-sm">20 random questions, 45 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">Get Feedback</h3>
              <p className="text-gray-600 text-sm">See correct answers & explanations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-bold mb-2">Pass Your Test</h3>
              <p className="text-gray-600 text-sm">75% needed to pass (15/20)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Day Tips */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Test Day Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-3">📚 Before the Test</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ Read &quot;Our Common Bond&quot; thoroughly</li>
                <li>✓ Practice regularly with our tests</li>
                <li>✓ Get a good night&apos;s sleep</li>
                <li>✓ Arrive early at the test center</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-3">⏱️ During the Test</h3>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ Read each question carefully</li>
                <li>✓ Manage your 45 minutes wisely</li>
                <li>✓ Don&apos;t rush - you have plenty of time</li>
                <li>✓ Stay calm and focused</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Government Disclaimer */}
      <section className="py-8 px-4 bg-yellow-50 border-t border-b border-yellow-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> This is an independent practice tool, not affiliated with the Australian Government. 
            Please refer to the <Link href="/legal/disclaimer" className="underline">official sources</Link> for citizenship information.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">🇦🇺 GetCitizenship.com.au</h3>
              <p className="text-gray-400 text-sm">Helping you prepare for the Australian Citizenship Test since 2025.</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Practice</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/test" className="hover:text-white transition">Practice Test</Link></li>
                <li><Link href="/study" className="hover:text-white transition">Study Mode</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/legal/disclaimer" className="hover:text-white transition">Disclaimer</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Official Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://immi.homeaffairs.gov.au/citizenship" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Department of Home Affairs</a></li>
                <li><a href="https://immi.homeaffairs.gov.au/citizenship-subsite/files/our-common-bond.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Our Common Bond (PDF)</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 GetCitizenship.com.au. All rights reserved.</p>
            <p className="mt-2">Not affiliated with the Australian Government.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
