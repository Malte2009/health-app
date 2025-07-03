import type { exercise } from "./exerciseType";

export type training = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
  type: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  duration?: number;
  avgHeartRate?: number;

  exercises: exercise[];
};

export type updateTrainingLogRequestType = {
  id: string;
  userId: string;
  type?: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  duration?: number;
  avgHeartRate?: number;

  exercises: exercise[];
};

export type createTrainingLogRequestType = {
  type: string;
  avgHeartRate?: number;
  duration?: number;
  notes?: string;
  pauses?: number;
  pausesLength?: number;
};

export type createTrainingResponseType = {
  avgHeartRate?: number;
  id: string;
  createdAt: Date;
  changedAt?: Date;
  userId: string;
  type: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  duration?: number;
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
  duration?: number;
  avgHeartRate?: number;

  exercises: exercise[];
};
