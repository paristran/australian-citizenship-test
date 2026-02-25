'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'
import { createPortal } from 'react-dom'

export default function Navigation() {
  const { user, profile, signOut, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 280
      })
    }
  }

  useEffect(() => {
    if (showDropdown) {
      updateCoords()
    }
  }, [showDropdown])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!showDropdown) return
      
      const target = e.target as Node
      const button = buttonRef.current
      const dropdown = dropdownRef.current
      
      if (button && dropdown) {
        if (!button.contains(target) && !dropdown.contains(target)) {
          setShowDropdown(false)
        }
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [showDropdown])

  const handleSignOut = async () => {
    setShowDropdown(false)
    await signOut()
  }

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
                <button
                  ref={buttonRef}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowDropdown(v => !v)
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  type="button"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block font-medium">{profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
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
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: '280px',
            zIndex: 999999,
          }}
          className="bg-white rounded-xl shadow-2xl border border-gray-200 py-2"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-semibold text-gray-900">{profile?.full_name || user?.email}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>

          <Link 
            href="/dashboard" 
            onClick={() => setShowDropdown(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xl">📊</span>
            <div>
              <div className="font-medium">Dashboard</div>
              <div className="text-xs text-gray-500">View progress & stats</div>
            </div>
          </Link>

          <Link 
            href="/journey" 
            onClick={() => setShowDropdown(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xl">🇦🇺</span>
            <div>
              <div className="font-medium">My Journey</div>
              <div className="text-xs text-gray-500">Create citizenship timeline</div>
            </div>
          </Link>

          <Link 
            href="/test" 
            onClick={() => setShowDropdown(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xl">📝</span>
            <div>
              <div className="font-medium">Practice Test</div>
              <div className="text-xs text-gray-500">Take a timed test</div>
            </div>
          </Link>

          <Link 
            href="/study" 
            onClick={() => setShowDropdown(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xl">📚</span>
            <div>
              <div className="font-medium">Study Mode</div>
              <div className="text-xs text-gray-500">Learn by category</div>
            </div>
          </Link>

          <Link 
            href="/complete-profile" 
            onClick={() => setShowDropdown(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <span className="text-xl">👤</span>
            <div>
              <div className="font-medium">Profile Settings</div>
              <div className="text-xs text-gray-500">Update your details</div>
            </div>
          </Link>

          <div className="border-t border-gray-100 my-2"></div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-600 text-left"
          >
            <span className="text-xl">🚪</span>
            <div>
              <div className="font-medium">Sign Out</div>
              <div className="text-xs text-red-400">Log out of your account</div>
            </div>
          </button>
        </div>,
        document.body
      )}
    </>
  )
}
