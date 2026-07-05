export type IntakeLog = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  timestamp: string;
  water_ml: number | null;
  otherFluid_ml: number | null;
  beverageType: string | null;
  saltMg: number | null;
  saltSource: string | null;
  caffeine_mg: number | null;
  alcohol_g: number | null;
  notes: string | null;
};

export type CreateIntakeLogRequest = Omit<IntakeLog, "id" | "userId" | "createdAt" | "changedAt">;
export type UpdateIntakeLogRequest = Partial<CreateIntakeLogRequest>;
