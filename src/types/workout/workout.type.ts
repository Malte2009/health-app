import type { BloodPressureLog } from "@/types/vitals/bloodPressureLog.type.ts";
import type { HrvRecording } from "@/types/hrv/hrvRecording.type.ts";
import type { SyncopeLog } from "@/types/symptoms/syncopeType.ts";
import type { WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";

export type Workout = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  name: string;
  type: string | null;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  duration: number | null;
  avgHeartRate: number | null;
  pauses: number;
  pauseLength: number;
  abortedDueToSymptoms: boolean;
  abortSymptom: string | null;
  postExerciseBpSys: number | null;
  postExerciseBpDia: number | null;
  postExerciseBpMin: number | null;
  hrvRecording?: HrvRecording | null;
  bloodPressureLogs?: BloodPressureLog[];
  syncopeLogs?: SyncopeLog[];
  workoutExercises?: WorkoutExercise[];
};

export type createWorkoutType = {
  name: string;
  type?: string | null;
  notes?: string | null;
  duration?: number | null;
  avgHeartRate?: number | null;
  pauses?: number;
  pauseLength?: number;
  abortedDueToSymptoms?: boolean;
  abortSymptom?: string | null;
  postExerciseBpSys?: number | null;
  postExerciseBpDia?: number | null;
  postExerciseBpMin?: number | null;
};

export type updateWorkoutType = Partial<createWorkoutType>;

export type CreateWorkoutRequest = createWorkoutType;
export type UpdateWorkoutRequest = updateWorkoutType;
