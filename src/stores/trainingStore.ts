import { defineStore } from "pinia";
import type { getTrainingResponseType, trainingLog } from "@/types/trainingType.ts";
import type { exerciseLog } from "@/types/exerciseLogType.ts";
import type { set } from "@/types/setType.ts";
import { getTrainingLogsWithExercises } from "@/services/trainingService.ts";

export const useTrainingLogStore = defineStore("trainingLogStore", {
  state: () => ({
    trainingLogs: [] as trainingLog[],
    currentTraining: "",
  }),
  getters: {
  },
  actions: {
  },
});
