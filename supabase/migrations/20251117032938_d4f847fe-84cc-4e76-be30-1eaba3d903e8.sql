-- Add user_id column to audio_analyses table
ALTER TABLE public.audio_analyses 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing data to have a NULL user_id (since no auth exists yet)
-- New inserts will require user_id

-- Drop old public policies
DROP POLICY IF EXISTS "Anyone can insert audio analyses" ON public.audio_analyses;
DROP POLICY IF EXISTS "Anyone can view audio analyses" ON public.audio_analyses;

-- Create new RLS policies requiring authentication
CREATE POLICY "Users can insert their own audio analyses"
ON public.audio_analyses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own audio analyses"
ON public.audio_analyses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own audio analyses"
ON public.audio_analyses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audio analyses"
ON public.audio_analyses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);