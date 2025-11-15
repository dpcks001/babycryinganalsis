import Meyda from 'meyda';

export interface AudioAnalysisResult {
  duration: number;
  rms_avg: number;
  rms_max: number;
  spectral_centroid_mean: number;
  spectral_rolloff_mean: number;
  zcr_mean: number;
  mfcc_mean: number[];
  energy_avg: number;
  timestamp: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    if (!this.stream) {
      const granted = await this.requestPermission();
      if (!granted) throw new Error('마이크 권한이 필요합니다');
    }

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream!);
    
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        throw new Error('녹음이 시작되지 않았습니다');
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  async analyzeAudio(audioBlob: Blob): Promise<AudioAnalysisResult> {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const duration = audioBuffer.duration;
    const channelData = audioBuffer.getChannelData(0);
    
    // Basic RMS calculation
    let sumSquares = 0;
    let maxRms = 0;
    const windowSize = 2048;
    
    for (let i = 0; i < channelData.length; i += windowSize) {
      let windowSum = 0;
      const end = Math.min(i + windowSize, channelData.length);
      
      for (let j = i; j < end; j++) {
        windowSum += channelData[j] * channelData[j];
      }
      
      const rms = Math.sqrt(windowSum / (end - i));
      sumSquares += windowSum;
      maxRms = Math.max(maxRms, rms);
    }
    
    const rms_avg = Math.sqrt(sumSquares / channelData.length);

    // Use Meyda for advanced features - process in chunks
    const spectralCentroids: number[] = [];
    const spectralRolloffs: number[] = [];
    const zcrs: number[] = [];
    const mfccs: number[][] = [];
    const energies: number[] = [];

    for (let i = 0; i < channelData.length; i += windowSize) {
      const end = Math.min(i + windowSize, channelData.length);
      if (end - i < windowSize) break; // Skip last incomplete window
      
      const chunk = channelData.slice(i, end);
      const features = Meyda.extract([
        'spectralCentroid',
        'spectralRolloff',
        'zcr',
        'mfcc',
        'energy'
      ], chunk);

      if (features.spectralCentroid) spectralCentroids.push(features.spectralCentroid);
      if (features.spectralRolloff) spectralRolloffs.push(features.spectralRolloff);
      if (features.zcr) zcrs.push(features.zcr);
      if (features.mfcc) mfccs.push(features.mfcc);
      if (features.energy) energies.push(features.energy);
    }

    // Calculate averages from collected features
    const avgSpectralCentroid = spectralCentroids.length > 0 
      ? spectralCentroids.reduce((a, b) => a + b, 0) / spectralCentroids.length 
      : 0;
    
    const avgSpectralRolloff = spectralRolloffs.length > 0
      ? spectralRolloffs.reduce((a, b) => a + b, 0) / spectralRolloffs.length
      : 0;
    
    const avgZcr = zcrs.length > 0
      ? zcrs.reduce((a, b) => a + b, 0) / zcrs.length
      : 0;
    
    const avgEnergy = energies.length > 0
      ? energies.reduce((a, b) => a + b, 0) / energies.length
      : 0;

    // Average MFCC coefficients
    const avgMfcc = mfccs.length > 0
      ? mfccs[0].map((_, i) => 
          mfccs.reduce((sum, mfcc) => sum + mfcc[i], 0) / mfccs.length
        )
      : [];

    const result: AudioAnalysisResult = {
      duration,
      rms_avg,
      rms_max: maxRms,
      spectral_centroid_mean: avgSpectralCentroid,
      spectral_rolloff_mean: avgSpectralRolloff,
      zcr_mean: avgZcr,
      mfcc_mean: avgMfcc,
      energy_avg: avgEnergy,
      timestamp: new Date().toISOString()
    };

    await audioContext.close();
    return result;
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
