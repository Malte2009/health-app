import type { WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";

export type WorkoutSet = {
  id: string;
  workoutExerciseId: string;
  userId: string;
  type: string | null;
  setTime: number | null;
  createdAt: string;
  changedAt: string | null;
  order: number;
  reps: number;
  repUnit: string;
  weight: number;
  workoutExercise?: WorkoutExercise;
};

export type createWorkoutSetType = {
  type?: string | null;
  repUnit?: string;
  reps: number;
  weight: number;
  setTime?: number | null;
  order?: number;
};

export type updateWorkoutSetType = Partial<createWorkoutSetType>;

export type CreateWorkoutSetRequest = createWorkoutSetType;
export type UpdateWorkoutSetRequest = updateWorkoutSetType;
