'use client'

import { createClient } from '@/lib/supabase/client'

export async function saveTestAttempt(data: {
  score: number
  totalQuestions: number
  percentage: number
  timeSpentSeconds: number
  answers: Array<{
    questionId: number
    selectedAnswer: number
    isCorrect: boolean
  }>
}) {
  const supabase = createClient()
  
  const response = await fetch('/api/test-attempts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return response.json()
}

export async function getTestAttempts(limit = 10) {
  const response = await fetch(`/api/test-attempts?limit=${limit}`)
  return response.json()
}

export async function getProfile() {
  const response = await fetch('/api/profile')
  return response.json()
}

export async function updateProfile(data: {
  fullName?: string
  australianCouncil?: string
  citizenshipApplicationDate?: string
}) {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  return response.json()
}
