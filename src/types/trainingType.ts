import type { exerciseType } from "./exerciseType";

export type updateTrainingLogRequestType = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
  type: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  durationMinutes?: number;
  avgHeartRate?: number;

  exercises: exerciseType[];
};

export type createTrainingLogRequestType = {
  type: string;
  avgHeartRate?: number;
  durationMinutes?: number;
  notes?: string;
  pauses?: number;
  pausesLength?: number;
};

export type createTrainingResponseType = {
  id: string;
  userID: string;
  createdAt: Date;
  changedAt?: Date;
  type: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  durationMinutes?: number;
  avgHeartRate?: number;
};

export type getTrainingTypesResponseType = {
  type: string;
}[];

export type getTrainingResponseType = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
  type: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  durationMinutes?: number;
  avgHeartRate?: number;

  exercises: exerciseType[];
};
