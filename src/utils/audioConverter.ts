// Client-side audio conversion utilities using Web Audio API

export interface AudioProfile {
  sr: number;
  duration_sec: number;
  rms: number;
  zcr: number;
  spec64_logmag: number[];
}

/**
 * Convert m4a file to 48kHz mono PCM samples
 * Uses Web Audio API to decode audio
 */
export async function m4aToMonoPCM(file: File): Promise<{ samples: Float32Array; sampleRate: number }> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Create audio context with 48kHz sample rate
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 48000
  });
  
  try {
    // Decode audio file
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Get mono channel (mix down if stereo)
    let samples: Float32Array;
    
    if (audioBuffer.numberOfChannels === 1) {
      samples = audioBuffer.getChannelData(0);
    } else {
      // Mix down to mono by averaging channels
      const channel1 = audioBuffer.getChannelData(0);
      const channel2 = audioBuffer.getChannelData(1);
      samples = new Float32Array(audioBuffer.length);
      
      for (let i = 0; i < audioBuffer.length; i++) {
        samples[i] = (channel1[i] + channel2[i]) / 2;
      }
    }
    
    // Resample to 48kHz if needed (Web Audio API should handle this automatically)
    const targetSampleRate = 48000;
    
    return {
      samples,
      sampleRate: targetSampleRate
    };
    
  } finally {
    // Clean up audio context
    await audioContext.close();
  }
}

/**
 * Process m4a file and get audio profile from backend
 */
export async function m4aToAudioProfile(file: File): Promise<AudioProfile> {
  console.log('Converting m4a to PCM...');
  const { samples, sampleRate } = await m4aToMonoPCM(file);
  
  console.log(`Converted: ${samples.length} samples at ${sampleRate}Hz`);
  console.log(`Duration: ${(samples.length / sampleRate).toFixed(2)}s`);
  
  // Send to backend for vectorization
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data, error } = await supabase.functions.invoke('analyze-audio-vector', {
    body: {
      samples: Array.from(samples),
      sampleRate
    }
  });
  
  if (error) {
    throw new Error(`Failed to analyze audio: ${error.message}`);
  }
  
  return data as AudioProfile;
}

/**
 * Validate m4a file
 */
export function validateM4aFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 50MB' };
  }
  
  // Check file type
  const validTypes = ['audio/mp4', 'audio/x-m4a', 'audio/m4a'];
  if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.m4a')) {
    return { valid: false, error: 'File must be in m4a format' };
  }
  
  return { valid: true };
}
