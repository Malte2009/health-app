import type { HrvRecording } from "@/types/hrv/hrvRecording.type.ts";

export type SleepLog = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  date: string;
  sleepType: string | null;
  hoursSinceLastCaffeine: number | null;
  lastCaffeineAmountMg: number | null;
  bedTime: string | null;
  wakeTime: string | null;
  sleepLatencyMinutes: number | null;
  wakeEpisodes: number | null;
  subjectiveHours: number | null;
  restedScore: number | null;
  morningHeadache: boolean | null;
  morningDizziness: boolean | null;
  totalSleepMinutes: number | null;
  awakeMinutes: number | null;
  lightSleepMinutes: number | null;
  deepSleepMinutes: number | null;
  remSleepMinutes: number | null;
  turningSpikeCount: number | null;
  turningSpikeMaxHr: number | null;
  hrvRecording?: HrvRecording | null;
  notes: string | null;
};

export type CreateSleepLog = Partial<Omit<SleepLog, "id" | "userId" | "createdAt" | "changedAt" | "hrvRecording">> & {
  date: string;
};
export type UpdateSleepLog = Partial<CreateSleepLog>;
