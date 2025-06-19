

export type updateTrainingLogRequest = {
  avgHeartRate: number;
  duration: number;
  notes?: string;
}

export type createTrainingLogRequest = {
  notes?: string;
}
