export type bodyLog = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  weight: number;
  height: number;
  fatMass?: number;
  fatPercentage?: number;
  muscleMass?: number;
  waterMass?: number;
  BMI?: number;
  BMR?: number;
};

export type createBodyLogType = {
  weight: number;
  height: number;
  fatMass?: number;
  fatPercentage?: number;
  muscleMass?: number;
  waterMass?: number;
}

export type updateBodyLogType = {
  weight: number;
  height: number;
  fatMass?: number;
  fatPercentage?: number;
  muscleMass?: number;
  waterMass?: number;
}
