-- Create audio_analyses table
CREATE TABLE public.audio_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  duration FLOAT NOT NULL,
  rms_avg FLOAT NOT NULL,
  rms_max FLOAT NOT NULL,
  spectral_centroid_mean FLOAT NOT NULL,
  spectral_rolloff_mean FLOAT NOT NULL,
  zcr_mean FLOAT NOT NULL,
  mfcc_mean JSONB NOT NULL,
  energy_avg FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.audio_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view analyses)
CREATE POLICY "Anyone can view audio analyses" 
ON public.audio_analyses 
FOR SELECT 
USING (true);

-- Create policy for public insert access (anyone can insert analyses)
CREATE POLICY "Anyone can insert audio analyses" 
ON public.audio_analyses 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_audio_analyses_created_at ON public.audio_analyses(created_at DESC);