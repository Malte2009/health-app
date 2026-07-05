import type { Workout } from "@/types/workout/workout.type.ts";

export type HRContext = "SLEEP_TURNING" | "ORTHOSTATIC_TEST" | "POST_EXERCISE" | "PRESYNCOPE" | "REST" | "OTHER";

export type BloodPressureLog = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  timestamp: string;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  position: string | null;
  context: string | null;
  hoursSinceLastCaffeine: number | null;
  lastCaffeineAmountMg: number | null;
  minutesAfterPositionChange: number | null;
  symptoms: string | null;
  arm: string | null;
  workoutId: string | null;
  workout?: Workout | null;
};

export type CreateBloodPressureLog = Partial<Omit<BloodPressureLog, "id" | "userId" | "createdAt" | "changedAt" | "workout">> & {
  timestamp: string;
  systolic: number;
  diastolic: number;
};
export type UpdateBloodPressureLog = Partial<CreateBloodPressureLog>;
