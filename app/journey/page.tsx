'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { format, differenceInYears } from 'date-fns'
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
        // Initialize with default milestones
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
      title: 'Custom Milestone',
      icon: '📍',
      milestone_date: '',
    }])
  }

  const removeMilestone = (index: number) => {
    const updated = milestones.filter((_, i) => i !== index)
    setMilestones(updated)
  }

  const saveJourney = async () => {
    setSaving(true)
    try {
      // Filter out empty milestones
      const validMilestones = milestones.filter(m => m.milestone_date)
      
      // Calculate years if we have dates
      const dates = validMilestones
        .map(m => new Date(m.milestone_date!))
        .filter(d => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime())
      
      const years_in_australia = dates.length >= 2 
        ? differenceInYears(dates[dates.length - 1], dates[0])
        : undefined
      
      const start_year = dates.length > 0 ? dates[0].getFullYear() : undefined
      const end_year = dates.length > 0 ? dates[dates.length - 1].getFullYear() : undefined

      const response = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'My Citizenship Journey',
          subtitle: years_in_australia 
            ? `After ${years_in_australia}+ years, I am now a proud Australian citizen!`
            : 'My path to Australian citizenship',
          years_in_australia,
          start_year,
          end_year,
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
    if (!journeyRef.current) return

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
      toast.error('Failed to generate image')
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

  const shareOnSocial = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = `I just completed my Australian citizenship journey! 🇦🇺 Check out my milestones.`
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My Citizenship Journey</h1>
          <p className="text-gray-600">Create and share your path to Australian citizenship</p>
        </div>

        {/* Edit Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add Your Milestones</h2>
          
          <div className="space-y-4 mb-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={milestone.icon || '📍'}
                  onChange={(e) => updateMilestone(index, 'icon', e.target.value)}
                  className="w-12 text-2xl text-center bg-transparent border-none focus:outline-none"
                  placeholder="📍"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={milestone.title || ''}
                    onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                    className="w-full font-semibold bg-transparent border-none focus:outline-none mb-2"
                    placeholder="Milestone title"
                  />
                  <input
                    type="date"
                    value={milestone.milestone_date || ''}
                    onChange={(e) => updateMilestone(index, 'milestone_date', e.target.value)}
                    className="text-sm text-gray-600 bg-transparent border-none focus:outline-none"
                  />
                </div>
                {milestone.milestone_type === 'custom' && (
                  <button
                    onClick={() => removeMilestone(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={addCustomMilestone}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-gray-600"
            >
              + Add Custom Milestone
            </button>
            <button
              onClick={saveJourney}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
            >
              {saving ? 'Saving...' : 'Save Journey'}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        {milestones.some(m => m.milestone_date) && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyImageToClipboard}
                  disabled={generatingImage}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  📋 Copy Image
                </button>
                <button
                  onClick={downloadImage}
                  disabled={generatingImage}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📥 Download PNG
                </button>
              </div>
            </div>
            
            {/* Image Preview Area */}
            <div 
              ref={journeyRef}
              className="p-8 bg-gradient-to-br from-green-50 to-emerald-100"
              style={{ minHeight: '500px' }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">🇦🇺</div>
                <h1 className="text-3xl font-bold text-gray-900">My Citizenship Journey</h1>
                {journey?.subtitle && (
                  <p className="text-gray-600 mt-2">{journey.subtitle}</p>
                )}
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-300 transform -translate-y-1/2" />
                
                <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4">
                  {milestones
                    .filter(m => m.milestone_date)
                    .sort((a, b) => 
                      new Date(a.milestone_date!).getTime() - new Date(b.milestone_date!).getTime()
                    )
                    .map((milestone, index) => (
                      <div key={index} className="relative flex flex-col items-center">
                        {/* Node */}
                        <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl z-10 mb-4">
                          {milestone.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="text-center bg-white rounded-lg p-3 shadow-md w-full">
                          <div className="font-semibold text-sm text-gray-900 mb-1">
                            {milestone.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {milestone.milestone_date && format(new Date(milestone.milestone_date), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 flex justify-center gap-6">
                {journey?.years_in_australia && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                    <span>⏱️</span>
                    <span className="font-semibold">{journey.years_in_australia}+ Years</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                  <span>📍</span>
                  <span className="font-semibold">{milestones.filter(m => m.milestone_date).length} Milestones</span>
                </div>
                {journey?.start_year && journey?.end_year && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                    <span>📅</span>
                    <span className="font-semibold">{journey.start_year} - {journey.end_year}</span>
                  </div>
                )}
              </div>

              {/* Watermark */}
              <div className="mt-8 text-center text-xs text-gray-400">
                Generated at getcitizenship.com.au
              </div>
            </div>
          </div>
        )}

        {/* Share Section */}
        {milestones.some(m => m.milestone_date) && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Share Your Journey</h2>
            <p className="text-gray-600 text-center mb-6">
              Celebrate the journey! Easily share your milestones with friends and family.
            </p>
            
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
