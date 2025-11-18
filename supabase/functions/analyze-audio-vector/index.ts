import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AudioProfile {
  sr: number;
  duration_sec: number;
  rms: number;
  zcr: number;
  spec64_logmag: number[];
}

// Hann window function
function hannWindow(length: number): Float32Array {
  const window = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (length - 1)));
  }
  return window;
}

// Simple FFT implementation using DFT (for n_fft=256)
function computeFFT(samples: Float32Array, n_fft: number): Float32Array {
  const realPart = new Float32Array(n_fft);
  const imagPart = new Float32Array(n_fft);
  
  for (let k = 0; k < n_fft; k++) {
    let real = 0;
    let imag = 0;
    for (let n = 0; n < samples.length && n < n_fft; n++) {
      const angle = -2 * Math.PI * k * n / n_fft;
      real += samples[n] * Math.cos(angle);
      imag += samples[n] * Math.sin(angle);
    }
    realPart[k] = real;
    imagPart[k] = imag;
  }
  
  // Compute magnitude spectrum
  const magnitude = new Float32Array(n_fft);
  for (let i = 0; i < n_fft; i++) {
    magnitude[i] = Math.sqrt(realPart[i] * realPart[i] + imagPart[i] * imagPart[i]);
  }
  
  return magnitude;
}

// Vectorize audio following librosa-style approach
function vectorizeAudio(samples: Float32Array, sampleRate: number): AudioProfile {
  const duration = samples.length / sampleRate;
  
  // 1. RMS = sqrt(mean(x^2))
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    sumSquares += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sumSquares / samples.length);
  
  // 2. Zero Crossing Rate (sign change ratio)
  let zeroCrossings = 0;
  for (let i = 1; i < samples.length; i++) {
    if ((samples[i] >= 0 && samples[i-1] < 0) || (samples[i] < 0 && samples[i-1] >= 0)) {
      zeroCrossings++;
    }
  }
  const zcr = zeroCrossings / (samples.length - 1);
  
  // 3. STFT with n_fft=256, hann window, hop=n_fft/4
  const n_fft = 256;
  const hop_length = Math.floor(n_fft / 4); // 64
  const window = hannWindow(n_fft);
  
  const numFrames = Math.floor((samples.length - n_fft) / hop_length) + 1;
  const magnitudeSum = new Float32Array(n_fft).fill(0);
  
  // Process each frame
  for (let frameIdx = 0; frameIdx < numFrames; frameIdx++) {
    const startIdx = frameIdx * hop_length;
    const frame = new Float32Array(n_fft);
    
    // Apply window
    for (let i = 0; i < n_fft && (startIdx + i) < samples.length; i++) {
      frame[i] = samples[startIdx + i] * window[i];
    }
    
    // Compute FFT magnitude
    const magnitude = computeFFT(frame, n_fft);
    
    // Accumulate magnitudes
    for (let i = 0; i < n_fft; i++) {
      magnitudeSum[i] += magnitude[i];
    }
  }
  
  // 4. Average magnitude across all frames
  const magnitudeAvg = new Float32Array(n_fft);
  for (let i = 0; i < n_fft; i++) {
    magnitudeAvg[i] = magnitudeSum[i] / numFrames;
  }
  
  // 5. Apply log1p (log(1 + x)) and take first 64 bins
  const spec64_logmag: number[] = [];
  for (let i = 0; i < 64 && i < magnitudeAvg.length; i++) {
    spec64_logmag.push(Math.log1p(magnitudeAvg[i]));
  }
  
  return {
    sr: sampleRate,
    duration_sec: duration,
    rms,
    zcr,
    spec64_logmag
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { samples, sampleRate } = await req.json();
    
    if (!samples || !Array.isArray(samples)) {
      throw new Error('Invalid samples data');
    }
    
    if (!sampleRate || sampleRate <= 0) {
      throw new Error('Invalid sample rate');
    }
    
    console.log(`Processing audio: ${samples.length} samples at ${sampleRate}Hz`);
    
    // Convert to Float32Array
    const audioSamples = new Float32Array(samples);
    
    // Vectorize audio
    const profile = vectorizeAudio(audioSamples, sampleRate);
    
    console.log(`Analysis complete: RMS=${profile.rms.toFixed(4)}, ZCR=${profile.zcr.toFixed(4)}`);
    
    return new Response(
      JSON.stringify(profile),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in analyze-audio-vector:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
