import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-6xl mb-6">🇦🇺</div>
          <h1 className="mb-6">
            <span className="gradient-text">Australian</span><br/>
            <span className="text-gray-400">Citizenship Test</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Prepare with confidence. 1000+ practice questions based on "Our Common Bond" — the official test resource.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/test" className="btn btn-primary">
              Start Practice Test
            </Link>
            <Link href="/study" className="btn btn-secondary">
              Study Mode
            </Link>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-semibold mb-2">1000+ Questions</h3>
            <p className="text-gray-500">Comprehensive coverage of all testable content</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Test Simulation</h3>
            <p className="text-gray-500">Practice in exam-like conditions</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-500">See your improvement over time</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center mb-12">About the Citizenship Test</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-green-600">📋 Test Format</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  20 multiple choice questions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  45 minutes to complete
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Need 75% (15/20) to pass
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Questions from "Our Common Bond"
                </li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-green-600">📚 Testable Content</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Australia and its people
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Democratic beliefs, rights and liberties
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Government and the law
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Australian values
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-6">Ready to Start?</h2>
          <p className="text-xl opacity-90 mb-10">
            Join thousands who have successfully prepared for their citizenship test.
          </p>
          <Link href="/test" className="btn bg-white text-green-600 hover:bg-gray-100">
            Begin Practice Test →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400 text-center">
        <p className="mb-2">Based on "Our Common Bond" — Official Australian citizenship test resource</p>
        <p className="text-sm">This is a practice tool and is not affiliated with the Australian Government</p>
      </footer>
    </main>
  )
}
