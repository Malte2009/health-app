import type { WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";

export type Workout = {
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
  workoutExercises?: WorkoutExercise[];
}

export type createWorkoutType = {
  name: string;
  type?: string;
  notes?: string;
  duration?: number;
  avgHeartRate?: number;
  pauses?: number;
  pauseLength?: number;
}

export type updateWorkoutType = {
  name?: string;
  type?: string;
  notes?: string;
  duration?: number;
  avgHeartRate?: number;
  pauses?: number;
  pauseLength?: number;
}
