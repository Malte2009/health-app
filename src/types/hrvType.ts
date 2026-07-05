import type { SleepLog } from "@/types/sleepType.ts";

export type HrvRecordingQueryParams = {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  device?: string;
  context?: string;
  workoutId?: string;
  trainingLogId?: string;
  sleepLogId?: string;
  sleepingLogId?: string;
};

export type HrvMetricValue = number | boolean | string | null | undefined;

export type HrvMetric = Record<string, HrvMetricValue> & {
  adaptiveFilteringApplied?: boolean | null;
  artifactFilteringApplied?: boolean | null;
  movingAverageFilteringApplied?: boolean | null;
  rangeFilteringApplied?: boolean | null;
  mean_rr_ms?: number | null;
  mean_hr_bpm?: number | null;
  max_hr_bpm?: number | null;
  min_hr_bpm?: number | null;
  sdnn_ms?: number | null;
  rmssd_ms?: number | null;
  pnn50_percent?: number | null;
  vlf_power?: number | null;
  lf_power?: number | null;
  hf_power?: number | null;
  lf_hf_ratio?: number | null;
  hf_peak_hz?: number | null;
  rsa_bpm?: number | null;
  sd1_ms?: number | null;
  sd2_ms?: number | null;
  sd1_sd2_ratio?: number | null;
  baevsky_si?: number | null;
  csi?: number | null;
  cvi?: number | null;
  sample_entropy?: number | null;
  approx_entropy?: number | null;
  dfa_alpha1?: number | null;
  jump_count_100ms_200ms?: number | null;
  jump_count_200ms_300ms?: number | null;
  jump_count_300ms_400ms?: number | null;
  jump_count_400ms_500ms?: number | null;
  jump_count_500ms_600ms?: number | null;
  jump_count_600ms_700ms?: number | null;
  jump_count_700ms_800ms?: number | null;
  jump_count_800ms_900ms?: number | null;
  jump_count_900ms_1000ms?: number | null;
  jump_count_1000ms?: number | null;
};

export type HrvRecording = {
  id: string;
  name?: string;
  date?: string;
  startDateTime?: string;
  endDateTime?: string;
  device?: string;
  context?: string;
  workoutId?: string;
  sleepLogId?: string;
  sleepLog?: SleepLog;
  metrics?: HrvMetric[];
  metric?: HrvMetric;
  generationStatus?: "pending" | "processing" | "ready" | "failed";
  generatedAt?: string | null;
};
