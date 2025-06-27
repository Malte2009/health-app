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

export type getSetByIdResponseType = {
  id: string;
  exerciseId: string;
  userId: string;
  type: string | null;
  date: string;
  time: string;
  reps: number;
  weight: number;
};

export type getSetTypesResponseType = {
  type: string | null;
}[];
