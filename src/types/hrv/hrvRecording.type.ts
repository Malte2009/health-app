import type { HrvMetrics } from "@/types/hrv/hrvMetrics.type.ts";
import type { HrvWindow } from "@/types/hrv/hrvWindow.type.ts";
import type { SleepLog } from "@/types/vitals/sleepLog.type.ts";
import type { Workout } from "@/types/workout/workout.type.ts";

export type HrvRecording = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  name: string | null;
  date: string;
  startDateTime: string | null;
  endDateTime: string | null;
  device: string | null;
  sleepLogId: string | null;
  workoutId: string | null;
  context: string | null;
  sleepLog?: SleepLog | null;
  workout?: Workout | null;
  windows?: HrvWindow[];
  metrics?: HrvMetrics[];
};

export type CreateHrvRecordingRequest = Omit<
  HrvRecording,
  "id" | "userId" | "createdAt" | "changedAt" | "sleepLog" | "workout" | "windows" | "metrics"
>;
export type UpdateHrvRecordingRequest = Partial<CreateHrvRecordingRequest>;
