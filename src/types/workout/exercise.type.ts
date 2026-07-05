import type { WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";

export type Exercise = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  changedAt: string | null;
  workoutExercises?: WorkoutExercise[];
};

export type CreateExerciseRequest = {
  name: string;
};

export type UpdateExerciseRequest = Partial<CreateExerciseRequest>;
