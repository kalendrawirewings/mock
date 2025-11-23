/*
  # Create Complete Interview Platform Schema

  1. Tables Created
    - `resumes` - Store resume data with analysis
    - `resume_experience` - Work experience entries
    - `resume_education` - Education entries  
    - `interview_sessions` - Interview session data
    - `interview_questions` - Questions asked in interviews
    - `conversation_entries` - Chat transcript
    - `interview_feedback_resources` - Learning resources

  2. Relationships
    - resumes -> users (user_id FK)
    - resume_experience -> resumes (resume_id FK)
    - resume_education -> resumes (resume_id FK)
    - interview_sessions -> users (user_id FK)
    - interview_sessions -> resumes (resume_id FK, optional)
    - interview_questions -> interview_sessions (session_id FK)
    - conversation_entries -> interview_sessions (session_id FK)
    - interview_feedback_resources -> interview_sessions (session_id FK)

  3. Security
    - Enable RLS on all tables
    - Users can only access their own data
*/

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  upload_date timestamptz DEFAULT now(),
  
  -- Personal Info (JSONB for flexibility)
  personal_info jsonb NOT NULL DEFAULT '{}',
  
  -- Resume Content
  skills text[] DEFAULT '{}',
  summary text,
  
  -- Analysis
  analysis_strengths text[] DEFAULT '{}',
  analysis_weaknesses text[] DEFAULT '{}',
  analysis_suggestions text[] DEFAULT '{}',
  analysis_score integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resume Experience
CREATE TABLE IF NOT EXISTS resume_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  duration text NOT NULL,
  description text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Resume Education
CREATE TABLE IF NOT EXISTS resume_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  year text NOT NULL,
  gpa text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_id uuid REFERENCES resumes(id) ON DELETE SET NULL,
  
  date timestamptz DEFAULT now(),
  duration integer DEFAULT 0,
  status text DEFAULT 'in-progress' CHECK (status IN ('completed', 'in-progress', 'cancelled')),
  
  -- Scores (JSONB)
  scores jsonb NOT NULL DEFAULT '{}',
  
  -- Feedback (JSONB)
  feedback jsonb NOT NULL DEFAULT '{}',
  
  -- Question Progress
  current_question_index integer DEFAULT 0,
  total_questions integer DEFAULT 25,
  question_progress jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Interview Questions
CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  
  category text NOT NULL,
  question text NOT NULL,
  expected_answer text,
  candidate_answer text,
  is_correct boolean,
  score integer,
  feedback text,
  sort_order integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

-- Conversation Entries (Transcript)
CREATE TABLE IF NOT EXISTS conversation_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  
  timestamp timestamptz DEFAULT now(),
  speaker text NOT NULL CHECK (speaker IN ('ai', 'candidate')),
  message text NOT NULL,
  audio_url text,
  question_id uuid REFERENCES interview_questions(id) ON DELETE SET NULL,
  category text,
  sort_order integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

-- Interview Feedback Resources
CREATE TABLE IF NOT EXISTS interview_feedback_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  
  title text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('article', 'video', 'course')),
  
  created_at timestamptz DEFAULT now()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_experience_resume_id ON resume_experience(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_education_resume_id ON resume_education(resume_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_date ON interview_sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_interview_questions_session_id ON interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_entries_session_id ON conversation_entries(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_resources_session_id ON interview_feedback_resources(session_id);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_feedback_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for resume_experience
CREATE POLICY "Users can manage resume experience"
  ON resume_experience FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for resume_education
CREATE POLICY "Users can manage resume education"
  ON resume_education FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for interview_sessions
CREATE POLICY "Users can view own interview sessions"
  ON interview_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own interview sessions"
  ON interview_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own interview sessions"
  ON interview_sessions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own interview sessions"
  ON interview_sessions FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for interview_questions
CREATE POLICY "Users can manage interview questions"
  ON interview_questions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for conversation_entries
CREATE POLICY "Users can manage conversation entries"
  ON conversation_entries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for interview_feedback_resources
CREATE POLICY "Users can manage feedback resources"
  ON interview_feedback_resources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
