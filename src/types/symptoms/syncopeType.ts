import type { SymptomLog } from "@/types/symptoms/symptomType.ts";
import type { Workout } from "@/types/workout/workout.type.ts";

export type SyncopeType = "ORTHOSTATIC" | "SITTING" | "SITUATIONAL" | "UNCLASSIFIED";
export type SyncopeOutcome = "PRESYNCOPE" | "SYNCOPE";

export type SyncopeLog = {
  id?: string;
  userId?: string;
  healthDayId?: string;
  createdAt?: string;
  changedAt?: string;
  timestamp?: string;
  name?: SyncopeType;
  type?: "SYNCOPE";
  outcome?: SyncopeOutcome;
  severity?: number;
  trigger?: string;
  position?: string;
  amnesia?: boolean;
  amnesiaDurationMinutes?: number;
  activityBefore?: string;
  hoursSinceLastMeal?: number;
  hoursSinceLastDrink?: number;
  saltSupplementation?: boolean;
  injuries?: string;
  symptoms?: SymptomLog[];
  workoutId?: string;
  workout?: Workout | null;
  notes?: string;
};

export type CreateSyncopeLogRequest = Omit<SyncopeLog, "id" | "userId" | "createdAt" | "changedAt" | "symptoms" | "workout">;
export type UpdateSyncopeLogRequest = Partial<CreateSyncopeLogRequest>;
