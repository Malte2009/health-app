import type { workoutSet } from "@/types/setType.ts";

export type workoutExercise = {
  id: string;
  userId: string;
  workoutId: string;
  name: string;
  createdAt: Date;
  changedAt: Date | null;
  order: number;
  notes: string | null;
  sets: workoutSet[];
};

export type createWorkoutExerciseRequest = {
  name: string;
  notes?: string;
  order?: number;
};

export type changeWorkoutExerciseRequest = {
  id: string;
  workoutId: string;
  name?: string;
  notes?: string;
  order?: number;
  newWorkoutId?: string;
};

export type exerciseLog = workoutExercise & {
  trainingId: string;
};

export type createExerciseLogRequest = createWorkoutExerciseRequest & {
  trainingId: string;
};

export type changeExerciseLogRequest = Omit<changeWorkoutExerciseRequest, "workoutId" | "newWorkoutId"> & {
  trainingId: string;
  workoutId?: string;
};
