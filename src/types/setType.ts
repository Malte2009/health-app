export type workoutSet = {
  id: string;
  type?: string;
  createdAt: Date;
  changedAt?: Date;
  order: number;
  reps: number;
  weight: number;
  workoutExerciseId: string;
  userId: string;
  repUnit: string;
  setTime?: number;
};

export type createWorkoutSetRequest = {
  workoutId?: string;
  type: string;
  reps: number;
  weight: number;
  workoutExerciseId?: string;
  repUnit: string;
  setTime?: number;
  order?: number;
};

export type changeWorkoutSetRequest = {
  id: string;
  workoutId: string;
  workoutExerciseId: string;
  type?: string | null;
  reps?: number;
  weight?: number;
  repUnit?: string;
  setTime?: number | null;
  order?: number;
};

export type set = workoutSet & {
  exerciseLogId: string;
};
export type createSetRequestType = createWorkoutSetRequest;
export type changeSetRequestType = changeWorkoutSetRequest;
