import { defineStore } from "pinia";
import type { getTrainingResponseType } from "@/types/trainingType.ts";

export const useTrainingStore = defineStore("trainingStore", {
  state: () => ({
    trainings: [] as getTrainingResponseType[],
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
    changeTraining(trainingId: string, training: getTrainingResponseType) {
      const index = this.trainings.findIndex((t) => t.id === trainingId);
      if (index !== -1) {
        this.trainings[index] = training;
      } else {
        console.warn(`Training with ID ${trainingId} not found.`);
      }
    },
    addTraining(training: getTrainingResponseType) {
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
