import type { set } from "@/types/setType.ts";

export type exerciseLog = {
  id: string;
  userId: string;
  trainingId: string;
  name: string;
  createdAt: Date;
  changedAt: Date | null;
  order: number;
  notes: string | null;

  sets: set[];
};

export type createExerciseLogRequest = {
  name: string;
  trainingId: string;
  order: number;
  notes?: string;
};

export type changeExerciseLogRequest = {
  id: string;
  name?: string;
  notes?: string;
  order?: number;
};
