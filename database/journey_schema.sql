-- Citizenship Journey Milestones
CREATE TABLE IF NOT EXISTS citizenship_journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) DEFAULT 'My Citizenship Journey',
  subtitle TEXT,
  years_in_australia INTEGER,
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Milestones
CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES citizenship_journeys(id) ON DELETE CASCADE NOT NULL,
  milestone_type VARCHAR(50) NOT NULL, -- 'arrival', 'pr', 'application', 'approval', 'ceremony', 'custom'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  milestone_date DATE NOT NULL,
  icon VARCHAR(50) DEFAULT 'milestone', -- emoji or icon name
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE citizenship_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

-- Users can only see their own journeys
CREATE POLICY "Users can view own journey" ON citizenship_journeys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journey" ON citizenship_journeys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journey" ON citizenship_journeys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journey" ON citizenship_journeys
  FOR DELETE USING (auth.uid() = user_id);

-- Milestones policies
CREATE POLICY "Users can view own milestones" ON journey_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM citizenship_journeys 
      WHERE citizenship_journeys.id = journey_milestones.journey_id 
      AND citizenship_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own milestones" ON journey_milestones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM citizenship_journeys 
      WHERE citizenship_journeys.id = journey_milestones.journey_id 
      AND citizenship_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own milestones" ON journey_milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM citizenship_journeys 
      WHERE citizenship_journeys.id = journey_milestones.journey_id 
      AND citizenship_journeys.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own milestones" ON journey_milestones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM citizenship_journeys 
      WHERE citizenship_journeys.id = journey_milestones.journey_id 
      AND citizenship_journeys.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_journeys_user_id ON citizenship_journeys(user_id);
CREATE INDEX idx_milestones_journey_id ON journey_milestones(journey_id);
CREATE INDEX idx_milestones_date ON journey_milestones(milestone_date);
