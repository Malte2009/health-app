import type { WorkoutSet } from "@/types/workout/workoutSet.type.ts";
import type { Exercise } from "@/types/exerciseType.ts";

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  workoutId: string;
  createdAt: Date;
  changedAt?: Date;
  order: number;
  notes?: string;
  score?: number;

  workoutSets?: WorkoutSet[];
  exercise?: Exercise;
};

export type createWorkoutExerciseType = {
  name?: string;
  notes?: string;
  order?: number;
}

export type updateWorkoutExerciseType = {
  name?: string;
  notes?: string;
  order?: number;
  workoutId?: string;
}
