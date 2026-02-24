export type MilestoneType = 'arrival' | 'pr' | 'application' | 'approval' | 'ceremony' | 'custom'

export interface JourneyMilestone {
  id: string
  journey_id: string
  milestone_type: MilestoneType
  title: string
  description?: string
  milestone_date: string
  icon: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface CitizenshipJourney {
  id: string
  user_id: string
  title: string
  subtitle?: string
  years_in_australia?: number
  start_year?: number
  end_year?: number
  created_at: string
  updated_at: string
  milestones?: JourneyMilestone[]
}

export const DEFAULT_MILESTONES: Array<{
  type: MilestoneType
  title: string
  icon: string
  placeholder: string
}> = [
  { type: 'arrival', title: 'First Arrival in Australia', icon: '✈️', placeholder: 'When did you first arrive?' },
  { type: 'pr', title: 'Received Permanent Residency', icon: '🛂', placeholder: 'When did you get your PR?' },
  { type: 'application', title: 'Applied for Citizenship', icon: '📄', placeholder: 'When did you apply?' },
  { type: 'approval', title: 'Citizenship Approved', icon: '🏛️', placeholder: 'When were you approved?' },
  { type: 'ceremony', title: 'Citizenship Ceremony', icon: '🎉', placeholder: 'When is/was your ceremony?' },
]
