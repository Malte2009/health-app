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

export type HrvMetricVariant = "none" | "standard" | "all";

export type HrvWindowMetrics = Omit<HrvMetrics, "id" | "createdAt" | "changedAt" | "hrvRecordingId" | "hrvWindowId" | "hrvRecording" | "hrvWindow">;

export type HrvWindowSummary = Pick<HrvWindow, "id" | "windowStart" | "durationSeconds" | "eventTag"> & {
  metrics: Record<HrvMetricVariant, HrvWindowMetrics | null>;
};

export type HrvGenerationStatus = "pending" | "processing" | "ready" | "failed";

export type HrvWindowsResponse = {
  recording: {
    id: string;
    name: string | null;
    date: string;
    startDateTime: string | null;
    endDateTime: string | null;
    context: string | null;
    device: string | null;
  };
  generationStatus: HrvGenerationStatus;
  generatedAt: string | null;
  windows: HrvWindowSummary[];
};

export type CreateHrvWindowRequest = Omit<HrvWindow, "id" | "createdAt" | "changedAt" | "metrics" | "recording">;
export type UpdateHrvWindowRequest = Partial<CreateHrvWindowRequest>;
