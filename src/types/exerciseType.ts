import type { set } from "@/types/setType.ts";

export type exercise = {
    id: string;
    userId: string;
    trainingId: string;
    name: string;
    createdAt: Date;
    changedAt: Date | null;
    order: number;
    notes: string | null;

    sets: set[];
};

export type getExerciseNamesType = {
  name: string;
}[];

export type createExerciseLogRequest = {
  name: string;
  trainingId: string;
  order: number;
  notes: string | null;
};

export type createExerciseLogResponse = {
  id: string;
  userId: string;
  trainingId: string;
  name: string;
  createdAt: Date;
  changedAt: Date | null;
  order: number;
  notes: string | null;
};

export type changeExerciseRequest = {
  id: string;
  name: string | null;
  notes: string | null;
  order: number | null;
};

export type changeExerciseResponse = {
  order: number;
  id: string;
  userId: string;
  trainingId: string;
  name: string;
  createdAt: Date;
  changedAt: Date | null;
  notes: string | null;
};
