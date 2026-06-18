
export type WorkoutSet = {
  id: string;
  workoutExerciseId: string;
  createdAt: Date;
  changedAt?: Date;
  type?: string;
  reps: number;
  weight: number;
  setTime?: number;
  order: number;
  repUnit: string;
}

export type createWorkoutSetType = {
  type: string;
  repUnit: string;
  reps: number;
  weight: number;
  setTime?: number;
  order?: number;
}

export type updateWorkoutSetType = {
  type?: string;
  repUnit?: string;
  reps?: number;
  weight?: number;
  setTime?: number;
  order?: number;
}
