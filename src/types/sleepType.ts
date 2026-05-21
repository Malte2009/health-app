export type SleepLog = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  date: string;
  bedTime?: string;
  wakeTime?: string;
  sleepLatencyMinutes?: number;
  wakeEpisodes?: number;
  subjectiveHours?: number;
  restedScore?: number;
  morningHeadache?: boolean;
  morningDizziness?: boolean;
  totalSleepMinutes?: number;
  awakeMinutes?: number;
  lightSleepMinutes?: number;
  deepSleepMinutes?: number;
  remSleepMinutes?: number;
  turningSpikeCount?: number;
  turningSpikeMaxHr?: number;
  notes?: string;
  hrvRecording?: any;
};

export type CreateSleepLog = Omit<SleepLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateSleepLog = Partial<CreateSleepLog>;

