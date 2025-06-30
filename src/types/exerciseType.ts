export type getExerciseNamesType = {
  name: string;
}[];

export type createExerciseLogRequest = {
  name: string;
  trainingId: string;
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
};

export type changeExerciseOrderRequestType = {
  order: number;
};

export type changeExerciseOrderResponse = {
  sets: {
    id: string;
    userId: string;
    createdAt: Date;
    changedAt: Date | null;
    order: number;
    type: string | null;
    weight: number;
    exerciseId: string;
    reps: number;
  }[];
} & {
  id: string;
  userId: string;
  trainingId: string;
  name: string;
  createdAt: Date;
  changedAt: Date | null;
  order: number;
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
