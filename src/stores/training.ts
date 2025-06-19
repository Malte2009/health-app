import { defineStore } from "pinia";
import type { getTrainingResponse } from "@/types/trainingType.ts";

export const useTrainingStore = defineStore("trainingStore", {
  state: () => ({
    trainings: [] as getTrainingResponse[],
    currentTraining: "",
  }),
  getters: {
    getTrainings: (state) => state.trainings,
    getCurrentTraining: (state) => state.currentTraining,
    getTrainingById: (state) => {
      return (id: string) => state.trainings.find((training) => training.id === id);
    },
  },
  actions: {
    changeTraining(trainingId: string, training: getTrainingResponse) {
      const index = this.trainings.findIndex((t) => t.id === trainingId);
      if (index !== -1) {
        this.trainings[index] = training;
      } else {
        console.warn(`Training with ID ${trainingId} not found.`);
      }
    },
    addTraining(training: getTrainingResponse) {
      this.trainings.push(training);
    },
    setCurrentTraining(trainingId: string) {
      this.currentTraining = trainingId;
    },
    clearTrainings() {
      this.trainings = [];
      this.currentTraining = "";
    },
    removeTraining(trainingId: string) {
      this.trainings = this.trainings.filter((training) => training.id !== trainingId);
      if (this.currentTraining === trainingId) {
        this.currentTraining = "";
      }
    },
  },
});
