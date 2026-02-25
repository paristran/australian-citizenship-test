'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'

export default function Navigation() {
  const { user, profile, signOut, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debug logging
  useEffect(() => {
    console.log('Navigation state:', { loading, hasUser: !!user, userEmail: user?.email })
  }, [loading, user])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-[60] shadow-sm">
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
          <div className="flex items-center gap-2 sm:gap-4 relative">
            {user ? (
              // Show user dropdown even if still loading profile
              <>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/journey"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    My Journey
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

                {/* User Account Dropdown */}
                <div className="relative z-[200]" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">
                        {user.email}
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[9999]">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-semibold text-gray-900">
                          {profile?.full_name || user.email}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>

                      {/* Progress Section */}
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📊</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">My Progress</div>
                            <div className="text-sm text-gray-500">View test history & stats</div>
                          </div>
                        </div>
                      </Link>

                      {/* Journey Section */}
                      <Link
                        href="/journey"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🇦🇺</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">My Journey</div>
                            <div className="text-sm text-gray-500">Create & share citizenship timeline</div>
                          </div>
                        </div>
                      </Link>

                      {/* Profile Link */}
                      <Link
                        href="/complete-profile"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">👤</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">Profile Settings</div>
                            <div className="text-sm text-gray-500">Update your details</div>
                          </div>
                        </div>
                      </Link>

                      {/* Practice Test Link */}
                      <Link
                        href="/test"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors md:hidden"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📝</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">Practice Test</div>
                            <div className="text-sm text-gray-500">Take a new test</div>
                          </div>
                        </div>
                      </Link>

                      {/* Study Link */}
                      <Link
                        href="/study"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors md:hidden"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📚</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">Study Mode</div>
                            <div className="text-sm text-gray-500">Learn by topic</div>
                          </div>
                        </div>
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2"></div>

                      {/* Sign Out */}
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          signOut()
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🚪</span>
                          <div className="flex-1">
                            <div className="font-medium text-red-600">Sign Out</div>
                            <div className="text-sm text-gray-500">Log out of your account</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : loading ? (
              // Show loading skeleton only if no user
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
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
          </div>
        </div>
      </div>
    </nav>
  )
}
