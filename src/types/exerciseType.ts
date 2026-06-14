import type { exerciseLog } from "@/types/exerciseLogType.ts";


export type exerciseType = {
  name: string;
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
};
