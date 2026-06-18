import type { exerciseLog, workoutExercise } from "./exerciseLogType.ts";

export type workout = {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt?: Date;
  name: string;
  type?: string;
  score?: number;
  notes?: string;
  caloriesBurned?: number;
  duration?: number;
  avgHeartRate?: number;
  pauses?: number;
  pauseLength?: number;
  workoutExercises: workoutExercise[];
};

export type createWorkoutRequest = {
  name: string;
  type?: string;
  avgHeartRate?: number;
  duration?: number;
  notes?: string;
  pauses?: number;
  pauseLength?: number;
};

export type getWorkoutResponse = workout;

export type training = Omit<workout, "workoutExercises"> & {
  type: string;
  exerciseLogs: exerciseLog[];
};

export type createTrainingLogRequestType = createWorkoutRequest;

export type getTrainingResponseType = training;
