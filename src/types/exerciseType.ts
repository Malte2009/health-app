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
};

export type changeExerciseRequest = {
  id: string;
  name: string;
};

export type changeExerciseResponse = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  changedAt: Date;
  trainingId: string;
};
