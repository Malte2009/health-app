export type createSetRequestType = {
  type: string;
  reps: number;
  weight: number;
  exerciseId: string;
};

export type changeSetRequestType = {
  id: string;
  type: string;
  reps?: number;
  weight?: number;
  date?: string | null;
  time?: string | null;
  exerciseId?: string;
};
