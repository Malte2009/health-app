import type { exerciseLog } from "@/types/exerciseLogType.ts";


export type exerciseType = {
  name: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;

  exerciseLogs: exerciseLog[];
};
