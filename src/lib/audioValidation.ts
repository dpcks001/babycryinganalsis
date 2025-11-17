import { z } from "zod";

export const audioAnalysisSchema = z.object({
  duration: z.number().positive().max(3600, "Duration must be less than 1 hour"),
  rms_avg: z.number().min(0).max(1, "RMS average must be between 0 and 1"),
  rms_max: z.number().min(0).max(1, "RMS max must be between 0 and 1"),
  spectral_centroid_mean: z.number().positive("Spectral centroid must be positive"),
  spectral_rolloff_mean: z.number().positive("Spectral rolloff must be positive"),
  zcr_mean: z.number().min(0).max(1, "Zero crossing rate must be between 0 and 1"),
  mfcc_mean: z.array(z.number()).min(1).max(20, "MFCC array must have 1-20 values"),
  energy_avg: z.number().min(0, "Energy must be non-negative"),
  user_id: z.string().uuid("Invalid user ID")
});

export type AudioAnalysisInput = z.infer<typeof audioAnalysisSchema>;
