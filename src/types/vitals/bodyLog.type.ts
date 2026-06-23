export type BodyLog = {
  id: string;
  userId: string;
  healthDayId: string | null;
  createdAt: string;
  changedAt: string | null;
  weight: number;
  height: number;
  fatMass: number | null;
  fatPercentage: number | null;
  muscleMass: number | null;
  waterMass: number | null;
  BMI: number | null;
  BMR: number | null;
};

export type createBodyLogType = {
  weight: number;
  height: number;
  fatMass?: number | null;
  fatPercentage?: number | null;
  muscleMass?: number | null;
  waterMass?: number | null;
};

export type updateBodyLogType = createBodyLogType;

export type CreateBodyLogRequest = createBodyLogType;
export type UpdateBodyLogRequest = updateBodyLogType;
