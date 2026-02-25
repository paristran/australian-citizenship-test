'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { format, differenceInDays, differenceInYears } from 'date-fns'
import { toPng } from 'html-to-image'
import toast from 'react-hot-toast'
import { DEFAULT_MILESTONES, MilestoneType, JourneyMilestone, CitizenshipJourney } from '@/types/journey'

export default function JourneyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const journeyRef = useRef<HTMLDivElement>(null)
  
  const [journey, setJourney] = useState<CitizenshipJourney | null>(null)
  const [milestones, setMilestones] = useState<Partial<JourneyMilestone>[]>([])
  const [loadingJourney, setLoadingJourney] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('default')

  const themes = [
    { id: 'default', name: 'Aussie Green', bg: 'from-green-50 via-emerald-50 to-teal-50', primary: 'green' },
    { id: 'sunset', name: 'Golden Sunset', bg: 'from-orange-50 via-amber-50 to-yellow-50', primary: 'orange' },
    { id: 'ocean', name: 'Ocean Blue', bg: 'from-blue-50 via-cyan-50 to-sky-50', primary: 'blue' },
    { id: 'aboriginal', name: 'Outback Red', bg: 'from-red-50 via-orange-50 to-amber-50', primary: 'red' },
    { id: 'wattle', name: 'Golden Wattle', bg: 'from-yellow-50 via-lime-50 to-green-50', primary: 'yellow' },
    { id: 'twilight', name: 'Twilight Purple', bg: 'from-purple-50 via-pink-50 to-rose-50', primary: 'purple' },
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchJourney()
    }
  }, [user])

  const fetchJourney = async () => {
    try {
      const response = await fetch('/api/journey')
      const data = await response.json()
      
      if (data.journey) {
        setJourney(data.journey)
        setMilestones(data.journey.milestones || [])
      } else {
        setMilestones(DEFAULT_MILESTONES.map(m => ({
          milestone_type: m.type,
          title: m.title,
          icon: m.icon,
          milestone_date: '',
        })))
      }
    } catch (error) {
      console.error('Error fetching journey:', error)
      toast.error('Failed to load journey')
    } finally {
      setLoadingJourney(false)
    }
  }

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const addCustomMilestone = () => {
    setMilestones([...milestones, {
      milestone_type: 'custom',
      title: 'New Milestone',
      icon: '📍',
      milestone_date: '',
    }])
  }

  const removeMilestone = (index: number) => {
    const updated = milestones.filter((_, i) => i !== index)
    setMilestones(updated)
  }

  const calculateDuration = () => {
    const validDates = milestones
      .filter(m => m.milestone_date)
      .map(m => new Date(m.milestone_date!))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())

    if (validDates.length < 2) return null

    const firstDate = validDates[0]
    const lastDate = validDates[validDates.length - 1]
    
    const years = differenceInYears(lastDate, firstDate)
    const totalDays = differenceInDays(lastDate, firstDate)
    const daysAfterYears = totalDays % 365
    
    return {
      years,
      totalDays,
      daysAfterYears,
      firstDate,
      lastDate,
      formatted: years > 0 
        ? `${years} year${years > 1 ? 's' : ''}, ${daysAfterYears} day${daysAfterYears !== 1 ? 's' : ''}`
        : `${totalDays} day${totalDays !== 1 ? 's' : ''}`
    }
  }

  const saveJourney = async () => {
    setSaving(true)
    try {
      const validMilestones = milestones.filter(m => m.milestone_date)
      const duration = calculateDuration()
      
      const response = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'My Citizenship Journey',
          subtitle: duration 
            ? `After ${duration.formatted}, I became a proud Australian citizen!`
            : 'My path to Australian citizenship',
          years_in_australia: duration?.years,
          start_year: duration?.firstDate?.getFullYear(),
          end_year: duration?.lastDate?.getFullYear(),
          milestones: validMilestones,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setJourney(data.journey)
        toast.success('Journey saved!')
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save journey')
    } finally {
      setSaving(false)
    }
  }

  const generateImage = async () => {
    if (!journeyRef.current) return null

    setGeneratingImage(true)
    try {
      const dataUrl = await toPng(journeyRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#f0fdf4',
      })
      return dataUrl
    } catch (error) {
      console.error('Error generating image:', error)
      return null
    } finally {
      setGeneratingImage(false)
    }
  }

  const downloadImage = async () => {
    const dataUrl = await generateImage()
    if (dataUrl) {
      const link = document.createElement('a')
      link.download = 'my-citizenship-journey.png'
      link.href = dataUrl
      link.click()
      toast.success('Image downloaded!')
    }
  }

  const copyImageToClipboard = async () => {
    const dataUrl = await generateImage()
    if (dataUrl) {
      try {
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        toast.success('Image copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy image')
      }
    }
  }

  const shareOnSocial = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = `I just completed my Australian citizenship journey! 🇦🇺`
    const url = window.location.href
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }
    
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  if (loading || loadingJourney) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🇦🇺</div>
          <p className="text-gray-600">Loading your journey...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const duration = calculateDuration()
  const sortedMilestones = milestones
    .filter(m => m.milestone_date)
    .sort((a, b) => new Date(a.milestone_date!).getTime() - new Date(b.milestone_date!).getTime())

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">My Citizenship Journey</h1>
          <p className="text-gray-600">Create and share your path to Australian citizenship</p>
        </div>

        {/* Theme Selector */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="text-lg font-bold mb-3">Theme</h2>
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTheme === theme.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Layout: Milestones Editor + Preview Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Milestones Editor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Milestones</h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => {
                      const icons = ['✈️', '🛂', '📄', '🏛️', '🎉', '📍', '⭐', '🏠', '💼', '🎓']
                      const currentIndex = icons.indexOf(milestone.icon || '📍')
                      const nextIcon = icons[(currentIndex + 1) % icons.length]
                      updateMilestone(index, 'icon', nextIcon)
                    }}
                    className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
                  >
                    {milestone.icon || '📍'}
                  </button>
                  
                  <input
                    type="text"
                    value={milestone.title || ''}
                    onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                    className="flex-1 font-medium bg-transparent border-none focus:outline-none text-sm"
                    placeholder="Milestone title"
                  />
                  
                  <input
                    type="date"
                    value={milestone.milestone_date || ''}
                    onChange={(e) => updateMilestone(index, 'milestone_date', e.target.value)}
                    className="text-xs text-gray-600 bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  
                  {milestone.milestone_type === 'custom' && (
                    <button
                      onClick={() => removeMilestone(index)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button
                onClick={addCustomMilestone}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-gray-600 text-sm"
              >
                + Add Custom
              </button>
              <button
                onClick={saveJourney}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold text-sm"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">Preview</h2>
              {sortedMilestones.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={copyImageToClipboard}
                    disabled={generatingImage}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={downloadImage}
                    disabled={generatingImage}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    📥 Download
                  </button>
                </div>
              )}
            </div>
            
            {/* Preview Card */}
            <div 
              ref={journeyRef}
              className={`p-6 bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.bg || 'from-green-50 via-emerald-50 to-teal-50'} min-h-[500px]`}
            >
              {/* Header */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🇦🇺</div>
                <h1 className="text-2xl font-bold text-gray-900">My Citizenship Journey</h1>
                {duration && (
                  <p className="text-gray-600 mt-1 font-medium">
                    Total: {duration.formatted}
                  </p>
                )}
              </div>

              {/* Timeline */}
              <div className="max-w-md mx-auto space-y-4">
                {sortedMilestones.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    Add milestones to see your journey
                  </div>
                ) : (
                  sortedMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-lg flex-shrink-0">
                        {milestone.icon}
                      </div>
                      <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                        <div className="font-semibold text-gray-900 text-sm">
                          {milestone.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {milestone.milestone_date && format(new Date(milestone.milestone_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Stats */}
              {sortedMilestones.length > 0 && (
                <div className="mt-6 flex justify-center gap-3 flex-wrap">
                  {duration && (
                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow text-sm">
                      <span>⏱️</span>
                      <span className="font-semibold">{duration.formatted}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow text-sm">
                    <span>📍</span>
                    <span className="font-semibold">{sortedMilestones.length} Milestones</span>
                  </div>
                </div>
              )}

              {/* Watermark */}
              <div className="mt-6 text-center text-xs text-gray-400">
                getcitizenship.com.au
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        {sortedMilestones.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Share Your Journey</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => shareOnSocial('facebook')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                📘 Facebook
              </button>
              <button
                onClick={() => shareOnSocial('twitter')}
                className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-semibold"
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => shareOnSocial('linkedin')}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
              >
                💼 LinkedIn
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
