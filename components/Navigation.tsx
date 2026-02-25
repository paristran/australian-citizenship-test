'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'
import { createPortal } from 'react-dom'

export default function Navigation() {
  const { user, profile, signOut, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        })
      }
    }

    if (showDropdown) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [showDropdown])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (showDropdown) {
        const dropdown = document.getElementById('nav-dropdown')
        const button = buttonRef.current
        if (dropdown && button && !dropdown.contains(e.target as Node) && !button.contains(e.target as Node)) {
          setShowDropdown(false)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [showDropdown])

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80">
              <span className="text-3xl">🇦🇺</span>
              <span className="font-bold text-lg hidden sm:block">GetCitizenship</span>
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
                    <Link href="/journey" className="text-gray-700 hover:text-gray-900 font-medium">My Journey</Link>
                    <Link href="/test" className="text-gray-700 hover:text-gray-900 font-medium">Practice Test</Link>
                    <Link href="/study" className="text-gray-700 hover:text-gray-900 font-medium">Study</Link>
                  </div>

                  <button
                    ref={buttonRef}
                    onClick={() => setShowDropdown(!showDropdown)}
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

      {mounted && showDropdown && createPortal(
        <div
          id="nav-dropdown"
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2"
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`,
            width: '280px',
            zIndex: 99999
          }}
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-semibold">{profile?.full_name || user?.email}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>

          <Link href="/dashboard" onClick={() => setShowDropdown(false)} className="block px-4 py-3 hover:bg-gray-50">
            📊 <span className="ml-2">My Progress</span>
          </Link>

          <Link href="/journey" onClick={() => setShowDropdown(false)} className="block px-4 py-3 hover:bg-gray-50">
            🇦🇺 <span className="ml-2">My Journey</span>
          </Link>

          <Link href="/complete-profile" onClick={() => setShowDropdown(false)} className="block px-4 py-3 hover:bg-gray-50">
            👤 <span className="ml-2">Profile Settings</span>
          </Link>

          <div className="border-t border-gray-100 my-2"></div>

          <button
            onClick={() => { setShowDropdown(false); signOut(); }}
            className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600"
          >
            🚪 <span className="ml-2">Sign Out</span>
          </button>
        </div>,
        document.body
      )}
    </>
  )
}
