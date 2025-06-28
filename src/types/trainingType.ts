export type updateTrainingLogRequestType = {
  exercises: ({
    sets: {
      type: string;
      createdAt: Date;
      changedAt: Date;
      userId: string;
      id: string;
      order: number;
      weight: number;
      time: string | null;
      exerciseId: string;
      reps: number;
    }[];
  } & {
    id: string;
    name: string;
    createdAt: Date;
    changedAt: Date;
    order: number;
    trainingId: string;
  })[];
} & {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt: Date;
  type: string | null;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;
};

export type createTrainingLogRequestType = {
  type: string;
  avgHeartRate?: number;
  durationMinutes?: number;
  notes?: string;
  date: string;
  time?: string;
  pauses?: Number;
  pausesLength?: Number;
};

export type createTrainingResponseType = {
  id: string;
  userID: string;
  createdAt: Date;
  changedAt: Date;
  type: string | null;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;
};

export type getTrainingTypesResponseType = {
  type: string;
}[];

export type getTrainingResponseType = {
  exercises: ({
    sets: {
      type: string;
      createdAt: Date;
      changedAt: Date;
      userId: string;
      id: string;
      order: number;
      weight: number;
      time: string | null;
      exerciseId: string;
      reps: number;
    }[];
  } & {
    id: string;
    name: string;
    createdAt: Date;
    changedAt: Date;
    order: number;
    trainingId: string;
  })[];
} & {
  id: string;
  userId: string;
  createdAt: Date;
  changedAt: Date;
  type: string | null;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;
};
