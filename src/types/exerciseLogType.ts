import type { setLog } from "@/types/setType.ts";

export type exerciseLog = {
  id: string;
  userId: string;
  trainingId: string;
  createdAt: Date;
  changedAt?: Date;
  name: string;
  order: number;
  notes?: string;

  setLogs: setLog[];
};

export type changeExerciseLogRequest = {
  id: string;
  name?: string;
  notes?: string;
  order?: number;
};
