export type DailyLog = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  date: string;
  energyMorning: number | null;
  energyNoon: number | null;
  energyAfternoon: number | null;
  energyEvening: number | null;
  overallScore: number | null;
  symptomBurdenScore: number | null;
  workCapacity: string | null;
  activityLevel: string | null;
  targetWater_ml: number | null;
  actualWater_ml: number | null;
  saltSupplementedMg: number | null;
  headElevatedSleep: boolean | null;
  neckPositionManaged: boolean | null;
  syncopeCount: number;
  presyncopeCount: number;
  worstSymptom: string | null;
  emergencyAction: boolean;
  notes: string | null;
};

export type CreateDailyLogRequest = Omit<DailyLog, "id" | "userId" | "createdAt" | "changedAt">;
export type UpdateDailyLogRequest = Partial<CreateDailyLogRequest>;
