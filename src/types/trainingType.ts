import type { exerciseLog } from "./exerciseLogType.ts";

export type training = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
  name: string;
  type: string;
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
  name: string;
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
  name: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  duration?: number;
  avgHeartRate?: number;
  pauses?: number;
  pauseLength?: number;

  exerciseLogs: exerciseLog[];
};
