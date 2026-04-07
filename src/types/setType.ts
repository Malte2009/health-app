export type setLog = {
  id: string;
  userId: string;
  exerciseLogId: string;
  createdAt: Date;
  changedAt?: Date;
  order: number;
  reps: number;
  repUnit: string;
  weight: number;
};

export type createSetRequestType = {
  type?: string;
  reps: number;
  weight: number;
  exerciseLogId: string;
  repUnit: string;
};

export type changeSetRequestType = {
  id: string;
  type?: string;
  reps?: number;
  weight?: number;
  repUnit: string;
};
