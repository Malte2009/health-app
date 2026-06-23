import type { Exercise } from "@/types/workout/exercise.type.ts";
import type { Workout } from "@/types/workout/workout.type.ts";
import type { WorkoutSet } from "@/types/workout/workoutSet.type.ts";

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  userId: string;
  workoutId: string;
  createdAt: string;
  changedAt: string | null;
  order: number;
  notes: string | null;
  score: number | null;
  workoutSets?: WorkoutSet[];
  workout?: Workout;
  exercise?: Exercise;
};

export type createWorkoutExerciseType = {
  name?: string;
  exerciseId?: string;
  notes?: string | null;
  order?: number;
};

export type updateWorkoutExerciseType = {
  name?: string;
  exerciseId?: string;
  notes?: string | null;
  order?: number;
  workoutId?: string;
  score?: number | null;
};

export type CreateWorkoutExerciseRequest = createWorkoutExerciseType;
export type UpdateWorkoutExerciseRequest = updateWorkoutExerciseType;
