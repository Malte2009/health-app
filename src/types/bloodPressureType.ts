export type BloodPressureLog = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  timestamp: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  position?: string;
  context?: string;
  minutesAfterPositionChange?: number;
  symptoms?: string;
  arm?: string;
  trainingId?: string;
};

export type CreateBloodPressureLog = Omit<BloodPressureLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateBloodPressureLog = Partial<CreateBloodPressureLog>;

