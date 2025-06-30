import type { setType } from "@/types/setType.ts";

export type exerciseType = {
  id: string;
  userId: string;
  trainingId: string;
  name: string;
  createdAt: Date;
  changedAt?: Date;
  order: number;
  notes?: string;

  sets: setType[];
};

export type getExerciseNamesType = {
  name: string;
}[];

export type createExerciseLogRequest = {
  name: string;
  trainingId: string;
  order: number;
  notes?: string;
};

export type createExerciseLogResponse = {
  id: string;
  name: string;
  createdAt: Date;
  changedAt: Date;
  trainingId: string;
  order: number;
};

export type changeExerciseRequest = {
  id: string;
  name: string;
  notes?: string;
};

export type changeExerciseOrderRequestType = {
  order: number;
};

export type changeExerciseOrderResponse = {
  id: string;
  userId: string;
  trainingId: string;
  name: string;
  createdAt: Date;
  changedAt: Date | null;
  order: number;

  sets: setType[];
};

export type changeExerciseResponse = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  changedAt: Date;
  trainingId: string;
  order: number;
};
