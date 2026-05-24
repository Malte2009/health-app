import type { FoodLog } from "@/types/foodType.ts";
import type { SyncopeLog } from "@/types/symptoms/syncopeType.ts";


export type SymptomLog = {
  id?: string,
  userId?: string,
  createdAt?: Date,
  changedAt?: Date,

  timestamp?: string,
  name?: "HEADACHE" | "DIZZINESS" | "VISUAL_DISTURBANCE" | "PULSATILE_TINNITUS" | "NECK_PULSATION" | "POSITIONAL_PULSE_SPIKE" | "CONGESTION_FEELING" | "NAUSEA" | "COGNITIVE_FOG" | "FATIGUE" | "FLUSHING" | "URTICARIA" | "DERMATOGRAPHISM" | "DYSPNEA" | "CHEST_PRESSURE" | "LIGHTHEADEDNESS" | "OTHER"
  type?: "SYMPTOM"
  severity?: number
  position?: string

  trigger?: string

  worseOnBendingForward?: boolean
  worseOnLyingDown?: boolean
  betterOnLyingDown?: boolean
  pulsatile?: boolean

  notes?: string

  triggerFoodLogId?: string
  triggerFoodLog?: FoodLog
  syncopeLogId?: string
  syncopeLog?: SyncopeLog

  pictures?: SymptomPicture[]
}

export type SymptomPicture = {
  id: string,
  userId: string,
  symptomId: string
  createdAt: Date,

  filePath: string,
  fileName: string,
  mimeType: string,
  size: number

  symptom?: SymptomLog
}
