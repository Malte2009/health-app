import type { SleepLog } from "@/types/sleepType.ts";

export type HrvRecordingQueryParams = {
  name?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  device?: string;
  context?: string;
  workoutId?: string;
  sleepLogId?: string;
};

export type HrvMetricValue = number | boolean | string | null | undefined;

export type HrvMetric = Record<string, HrvMetricValue> & {
  adaptiveFilteringApplied?: boolean;
  artifactFilteringApplied?: boolean;
  movingAverageFilteringApplied?: boolean;
  rangeFilteringApplied?: boolean;
  mean_rr_ms?: number;
  mean_hr_bpm?: number;
  max_hr_bpm?: number;
  min_hr_bpm?: number;
  sdnn_ms?: number;
  rmssd_ms?: number;
  pnn50_percent?: number;
  vlf_power?: number;
  lf_power?: number;
  hf_power?: number;
  lf_hf_ratio?: number;
  hf_peak_hz?: number;
  rsa_bpm?: number;
  sd1_ms?: number;
  sd2_ms?: number;
  sd1_sd2_ratio?: number;
  baevsky_si?: number;
  csi?: number;
  cvi?: number;
  sample_entropy?: number;
  approx_entropy?: number;
  dfa_alpha1?: number;
  jump_count_100ms_200ms?: number;
  jump_count_200ms_300ms?: number;
  jump_count_300ms_400ms?: number;
  jump_count_400ms_500ms?: number;
  jump_count_500ms_600ms?: number;
  jump_count_600ms_700ms?: number;
  jump_count_700ms_800ms?: number;
  jump_count_800ms_900ms?: number;
  jump_count_900ms_1000ms?: number;
  jump_count_1000ms?: number;
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
};
