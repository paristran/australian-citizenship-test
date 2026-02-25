-- Run this in Supabase SQL Editor

-- Question Progress Tracking
CREATE TABLE IF NOT EXISTS question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  studied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_question_progress_user_id ON question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_question_progress_category ON question_progress(category);
CREATE INDEX IF NOT EXISTS idx_question_progress_studied_at ON question_progress(studied_at);

-- RLS Policies for question_progress
ALTER TABLE question_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON question_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON question_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON question_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Ensure test_attempts table has values tracking
ALTER TABLE test_attempts 
ADD COLUMN IF NOT EXISTS values_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS values_total INTEGER DEFAULT 5;
