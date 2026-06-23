import type { FoodLog } from "@/types/food/foodLog.type.ts";
import type { SyncopeLog } from "@/types/symptoms/syncopeType.ts";

export type SymptomType =
  | "HEADACHE"
  | "DIZZINESS"
  | "VISUAL_DISTURBANCE"
  | "PULSATILE_TINNITUS"
  | "NECK_PULSATION"
  | "POSITIONAL_PULSE_SPIKE"
  | "CONGESTION_FEELING"
  | "NAUSEA"
  | "COGNITIVE_FOG"
  | "FATIGUE"
  | "FLUSHING"
  | "URTICARIA"
  | "DERMATOGRAPHISM"
  | "GI_SYMPTOMS"
  | "RESPIRATORY"
  | "DYSPNEA"
  | "CHEST_PRESSURE"
  | "LIGHTHEADEDNESS"
  | "OTHER";

export type SymptomLog = {
  id?: string;
  userId?: string;
  healthDayId?: string;
  createdAt?: string;
  changedAt?: string;
  timestamp?: string;
  name?: SymptomType;
  type?: "SYMPTOM";
  severity?: number;
  position?: string;
  location?: string;
  trigger?: string;
  triggerFoodLogId?: string;
  triggerFoodLog?: FoodLog | null;
  worseOnBendingForward?: boolean;
  worseOnLyingDown?: boolean;
  betterOnLyingDown?: boolean;
  pulsatile?: boolean;
  notes?: string;
  syncopeLogId?: string;
  syncopeLog?: SyncopeLog | null;
  pictures?: SymptomPicture[];
};

export type SymptomPicture = {
  id: string;
  userId: string;
  symptomId: string;
  createdAt: string;
  filePath: string;
  filename: string;
  mimetype: string;
  size: number;
  symptom?: SymptomLog;
  fileName?: string;
  mimeType?: string;
};

export type CreateSymptomLogRequest = Omit<SymptomLog, "id" | "userId" | "createdAt" | "changedAt" | "triggerFoodLog" | "syncopeLog" | "pictures">;
export type UpdateSymptomLogRequest = Partial<CreateSymptomLogRequest>;
