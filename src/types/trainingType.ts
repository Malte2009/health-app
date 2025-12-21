import type { exerciseLog } from "./exerciseLogType.ts";

export type training = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
  type: string;
  mode: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  duration?: number;
  avgHeartRate?: number;
  pauses?: number;
  pauseLength?: number;

  exerciseLogs: exerciseLog[];
};

export type createTrainingLogRequestType = {
  type: string;
  mode: string;
  avgHeartRate?: number;
  duration?: number;
  notes?: string;
  pauses?: number;
  pauseLength?: number;
};

export type getTrainingResponseType = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
  type: string;
  mode: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  duration?: number;
  avgHeartRate?: number;
  pauses?: number;
  pauseLength?: number;

  exerciseLogs: exerciseLog[];
};
