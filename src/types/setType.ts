export type createSetRequestType = {
  reps: number;
  weight: number;
  exerciseId: string;
};

export type changeSetRequestType = {
  id: string;
  reps?: number;
  weight?: number;
  date?: string | null;
  time?: string | null;
  exerciseId?: string;
};
