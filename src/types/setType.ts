export type set = {
  id: string;
  type?: string;
  createdAt: Date;
  changedAt?: Date;
  order: number;
  reps: number;
  weight: number;
  exerciseId: string;
  userId: string;
};

export type createSetRequestType = {
  type?: string;
  reps: number;
  weight: number;
  exerciseId: string;
};

export type changeSetRequestType = {
  id: string;
  type?: string;
  reps?: number;
  weight?: number;
};
