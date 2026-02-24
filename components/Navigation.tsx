'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'

export default function Navigation() {
  const { user, profile, signOut, loading } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Home Link */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🇦🇺</span>
              <span className="font-bold text-lg hidden sm:block">GetCitizenship</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Desktop View */}
                    <div className="hidden md:flex items-center gap-4">
                      <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/test"
                        className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                      >
                        Practice Test
                      </Link>
                      <Link
                        href="/study"
                        className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                      >
                        Study
                      </Link>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-gray-900">
                          {profile?.full_name || user.email}
                        </div>
                      </div>
                      <button
                        onClick={signOut}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                      <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                      >
                        Menu
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest User Links */}
                    <Link
                      href="/test"
                      className="text-gray-700 hover:text-gray-900 font-medium transition-colors hidden sm:block"
                    >
                      Practice Test
                    </Link>
                    <Link
                      href="/study"
                      className="text-gray-700 hover:text-gray-900 font-medium transition-colors hidden sm:block"
                    >
                      Study
                    </Link>
                    
                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        href="/login"
                        className="text-sm bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
