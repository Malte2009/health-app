export type updateTrainingLogRequest = {
  avgHeartRate: number;
  duration: number;
  notes?: string;
};

export type createTrainingLogRequest = {
  type: string;
  avgHeartRate?: number;
  duration?: number;
  notes?: string;
  date: string;
  time?: string;
};

export type createTrainingResponse = {
  id: string;
  userID: string;
  date: string;
  time: string | null;
  type: string | null;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;
};

export type getTrainingResponse = {
  exercises: ({
    sets: {
      date: string | null;
      userId: string;
      id: string;
      weight: number;
      time: string | null;
      exerciseId: string;
      reps: number;
    }[];
  } & {
    date: string | null;
    id: string;
    name: string;
    time: string | null;
    trainingId: string;
  })[];
} & {
  id: string;
  userId: string;
  date: string;
  time: string | null;
  type: string | null;
  score: number | null;
  notes: string | null;
  caloriesBurned: number | null;
  durationMinutes: number | null;
  avgHeartRate: number | null;
};
