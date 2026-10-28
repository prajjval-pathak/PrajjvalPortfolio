-- ====================================================================
-- SUPABASE SCHEMA FOR PRAJJVAL PATHAK'S TECH LEARNINGS & NOTES
-- ====================================================================
-- Instructions:
-- 1. Log in to your Supabase project (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" on the left navigation bar
-- 3. Click "New Query", paste this entire file, and click "RUN"
-- ====================================================================

-- 1. Create the 'learnings' table
CREATE TABLE IF NOT EXISTS public.learnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('LLD', 'HLD', 'DS', 'AI', '.NET', 'JS')),
    date TEXT NOT NULL,
    read_time TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'Advanced',
    summary TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    key_takeaways TEXT[] DEFAULT '{}',
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create index on slug and category for ultra-fast queries
CREATE INDEX IF NOT EXISTS idx_learnings_slug ON public.learnings (slug);
CREATE INDEX IF NOT EXISTS idx_learnings_category ON public.learnings (category);
CREATE INDEX IF NOT EXISTS idx_learnings_created_at ON public.learnings (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.learnings ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow EVERYONE (public visitors) to READ learnings
DROP POLICY IF EXISTS "Allow Public Read Access" ON public.learnings;
CREATE POLICY "Allow Public Read Access" 
ON public.learnings 
FOR SELECT 
TO public 
USING (true);

-- 5. Policy: Allow writes (INSERT, UPDATE, DELETE)
-- For maximum convenience with your Admin Passcode:
DROP POLICY IF EXISTS "Allow Admin Access" ON public.learnings;
CREATE POLICY "Allow Admin Access" 
ON public.learnings 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);

-- 6. Trigger to automatically update 'updated_at' column on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_learnings_updated_at ON public.learnings;
CREATE TRIGGER set_learnings_updated_at
BEFORE UPDATE ON public.learnings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
