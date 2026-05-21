export interface IntakeLog {
  id?: string;
  quantity_mlMin_gMax_kcal?: number;
  timestamp: string;
  beverageType?: string;
  name?: string;
  water_ml?: number;
  otherFluid_ml?: number;
  saltSource?: string;
  saltMg?: number;
  caffeine_mg?: number;
  alcohol_g?: number;
  notes?: string;
}

export interface McasLog {
  id?: string;
  reactionType: string;
  severity: number;
  timestamp: string;
  onsetMinutes: number;
  durationMinutes: number;
  suspectedFood: string;
  hoursSinceMeal: number;
  histamineRichFood: boolean;
  additiveRich: boolean;
  ultraProcessed: boolean;
}

export interface SymptomLog {
  id?: string;
  timestamp: string;
  type?: string;
  name: string;
  severity: number;
  description: string;
  treatedWith: string;
  durationHours: number;
  durationMinutes?: number;
  triggerContext: string;
  trigger?: string;
  location?: string;
  outcome: string;
  onsetDateTime: string;
  offsetDateTime: string;
  worseOnBendingForward?: boolean;
  worseOnLyingDown?: boolean;
  betterOnLyingDown?: boolean;
  pulsatile?: boolean;
}

