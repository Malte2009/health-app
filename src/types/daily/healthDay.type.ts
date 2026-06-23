import type { DailyLog } from "@/types/daily/dailyLog.type.ts";
import type { Weather } from "@/types/daily/weather.type.ts";
import type { IntakeLog } from "@/types/food/intakeLog.type.ts";
import type { MealLog } from "@/types/food/mealLog.type.ts";
import type { HrvRecording } from "@/types/hrv/hrvRecording.type.ts";
import type { SyncopeLog } from "@/types/symptoms/syncopeType.ts";
import type { SymptomLog } from "@/types/symptoms/symptomType.ts";
import type { BloodPressureLog } from "@/types/vitals/bloodPressureLog.type.ts";
import type { BodyLog } from "@/types/vitals/bodyLog.type.ts";
import type { SleepLog } from "@/types/vitals/sleepLog.type.ts";
import type { Workout } from "@/types/workout/workout.type.ts";

export type HealthDayDateString = string;

export type HealthDayIncludeValue =
  | "dailyLog"
  | "weather"
  | "bodyLogs"
  | "workouts"
  | "workouts.exercises"
  | "workoutExercises"
  | "workouts.sets"
  | "workoutSets"
  | "mealLogs"
  | "mealLogs.foodLogs"
  | "foodLogs"
  | "mealLogs.food"
  | "food"
  | "intakeLogs"
  | "sleepLogs"
  | "bloodPressureLogs"
  | "symptomLogs"
  | "symptomLogs.pictures"
  | "symptomPictures"
  | "syncopeLogs"
  | "hrvRecordings"
  | "hrvRecordings.windows"
  | "hrvWindows"
  | "hrvRecordings.metrics"
  | "hrvMetrics";

export type HealthDayIncludeBooleanParams = {
  includeDailyLog?: boolean;
  includeWeather?: boolean;
  includeBodyLogs?: boolean;
  includeWorkouts?: boolean;
  includeWorkoutExercises?: boolean;
  includeWorkoutSets?: boolean;
  includeMealLogs?: boolean;
  includeFoodLogs?: boolean;
  includeFood?: boolean;
  includeIntakeLogs?: boolean;
  includeSleepLogs?: boolean;
  includeBloodPressureLogs?: boolean;
  includeSymptomLogs?: boolean;
  includeSymptomPictures?: boolean;
  includeSyncopeLogs?: boolean;
  includeHrvRecordings?: boolean;
  includeHrvWindows?: boolean;
  includeHrvMetrics?: boolean;
};

export type HealthDayIncludeQuery = HealthDayIncludeBooleanParams & {
  include?: HealthDayIncludeValue | HealthDayIncludeValue[];
  includeData?: boolean;
};

export type HealthDayListQuery = HealthDayIncludeQuery & {
  date?: HealthDayDateString;
  startDate?: HealthDayDateString;
  endDate?: HealthDayDateString;
};

export type CreateHealthDayRequest = {
  date: HealthDayDateString;
};

export type UpdateHealthDayRequest = {
  date: HealthDayDateString;
};

export type HealthDay = {
  id: string;
  userId: string;
  date: HealthDayDateString;
  createdAt: string;
  updatedAt: string | null;
  dailyLog?: DailyLog | null;
  weather?: Weather | null;
  bodyLogs?: BodyLog[];
  workouts?: Workout[];
  mealLogs?: MealLog[];
  intakeLogs?: IntakeLog[];
  sleepLogs?: SleepLog[];
  bloodPressureLogs?: BloodPressureLog[];
  symptomLogs?: SymptomLog[];
  syncopeLogs?: SyncopeLog[];
  hrvRecordings?: HrvRecording[];
};
