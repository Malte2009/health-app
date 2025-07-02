import type { exercise } from "./exerciseType";

export type training = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt: Date | null;
  type: string;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;

  exercises: exercise[];
}

export type updateTrainingLogRequestType = {
  id: string;
  userId: string;
  type: string | null;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;

  exercises: exercise[];
};

export type createTrainingLogRequestType = {
  type: string;
  avgHeartRate: number | null;
  durationMinutes: number | null;
  notes: string | null;
  pauses: number | null;
  pausesLength: number | null;
};

export type createTrainingResponseType = {
  avgHeartRate: number | null;
  id: string;
  createdAt: Date;
  changedAt: Date | null;
  userId: string;
  type: string;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
}

export type getTrainingTypesResponseType = {
  type: string;
}[];

export type getTrainingResponseType = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt: Date | null;
  type: string;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;

  exercises: exercise[];
};
