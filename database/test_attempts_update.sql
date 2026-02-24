-- Update test_attempts table to include Australian values scoring
ALTER TABLE test_attempts 
ADD COLUMN IF NOT EXISTS values_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS values_total INTEGER DEFAULT 5;

-- Update the answers JSON structure to track which questions are values questions
-- The existing answers column already stores JSON, so we just need to ensure the new structure is supported
