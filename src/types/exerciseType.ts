export type createExerciseLogRequest = {
  name: string;
  trainingId: string;
};

export type createExerciseLogResponse = {
  id: string;
  name: string;
  date: string;
  time: string;
  trainingId: string;
};

export type changeExerciseRequest = {
  id: string;
  name: string;
  date?: string;
  time?: string;
};

export type changeExerciseResponse = {
  id: string;
  name: string;
  userId: string;
  date: string;
  time: string;
  trainingId: string;
};
