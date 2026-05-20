export type set = {
  id: string;
  type?: string;
  createdAt: Date;
  changedAt?: Date;
  order: number;
  reps: number;
  weight: number;
  exerciseLogId: string;
  userId: string;
  repUnit: string;
  setTime?: number;
};

export type createSetRequestType = {
  type?: string;
  reps: number;
  weight: number;
  exerciseLogId: string;
  repUnit: string;
  setTime?: number;
};

export type changeSetRequestType = {
  id: string;
  type?: string;
  reps?: number;
  weight?: number;
  repUnit: string;
  setTime?: number;
};
