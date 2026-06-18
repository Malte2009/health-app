import type { SymptomLog } from "@/types/symptoms/symptomType.ts";
import type { Workout } from "@/types/workout/workout.type.ts";

export type SyncopeLog = {
  id?: string,
  userId?: string,
  createdAt?: Date,
  changedAt?: Date,

  timestamp?: string,
  name?: "ORTHOSTATIC" | "SITTING" | "SITUATIONAL" | "UNCLASSIFIED",
  type?: "SYNCOPE"
  outcome?: "PRESYNCOPE" | "SYNCOPE",
  severity?: number,
  trigger?: string,

  position?: string

  amnesia?: boolean,
  amnesiaDurationMinutes?: number,

  activityBefore?: string,

  hoursSinceLastMeal?: number,
  hoursSinceLastDrink?: number,
  saltSupplementation?: boolean,

  injuries?: string,

  symptoms?: SymptomLog[],

  workoutId?: string,
  workout?: Workout,

  notes?: string
}
