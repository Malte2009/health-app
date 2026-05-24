import type { SymptomLog } from "@/types/symptoms/symptomType.ts";
import type { training } from "@/types/trainingType.ts";

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

  trainingLogId?: string,
  trainingLog?: training,

  notes?: string
}
