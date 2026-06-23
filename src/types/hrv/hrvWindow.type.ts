import type { HrvMetrics } from "@/types/hrv/hrvMetrics.type.ts";
import type { HrvRecording } from "@/types/hrv/hrvRecording.type.ts";

export type HrvWindow = {
  id: string;
  recordingId: string;
  createdAt: string;
  changedAt: string | null;
  windowStart: string;
  durationSeconds: number;
  eventTag: string | null;
  metrics?: HrvMetrics[];
  recording?: HrvRecording;
};

export type CreateHrvWindowRequest = Omit<HrvWindow, "id" | "createdAt" | "changedAt" | "metrics" | "recording">;
export type UpdateHrvWindowRequest = Partial<CreateHrvWindowRequest>;
