'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'

export default function Navigation() {
  const { user, profile, signOut, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🇦🇺</span>
              <span className="font-bold text-lg hidden sm:block">GetCitizenship</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
                  <Link href="/journey" className="text-gray-700 hover:text-gray-900 font-medium">My Journey</Link>
                  <Link href="/test" className="text-gray-700 hover:text-gray-900 font-medium">Practice Test</Link>
                  <Link href="/study" className="text-gray-700 hover:text-gray-900 font-medium">Study</Link>
                </div>

                <div className="relative z-[200]" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDropdown(!showDropdown)
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:block font-medium">{profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                    <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[9999]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-semibold">{profile?.full_name || user.email}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>

                      <Link href="/dashboard" onClick={() => setShowDropdown(false)} className="block px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📊</span>
                          <span>My Progress</span>
                        </div>
                      </Link>

                      <Link href="/journey" onClick={() => setShowDropdown(false)} className="block px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🇦🇺</span>
                          <span>My Journey</span>
                        </div>
                      </Link>

                      <Link href="/complete-profile" onClick={() => setShowDropdown(false)} className="block px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">👤</span>
                          <span>Profile Settings</span>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button
                        onClick={() => { setShowDropdown(false); signOut(); }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🚪</span>
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sign In</Link>
                <Link href="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
