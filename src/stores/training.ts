import { defineStore } from "pinia";
import type { getTrainingResponseType } from "@/types/trainingType.ts";
import type { exerciseLog } from "@/types/exerciseLogType.ts";
import type { set } from "@/types/setType.ts";
import { getTrainings } from "@/services/trainingService.ts";

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
    getExerciseLogById: (state) => {
      return (exerciseLogId: string) => {
        return state.trainings.flatMap((training) => training.exerciseLogs).find((exerciseLog) => exerciseLog.id === exerciseLogId);
      };
    },
    getSetById: (state) => {
      return (setId: string) => {
        return state.trainings.flatMap((training) => training.exerciseLogs.flatMap((exerciseLog) => exerciseLog.sets)).find((set) => set.id === setId);
      };
    },
  },
  actions: {
    async sortExerciseLogs(trainingId: string) {
      const training = this.trainings.find((t) => t.id === trainingId);
      if (training) {
        training.exerciseLogs.sort((a, b) => a.order - b.order);
      } else {
        console.warn(`Training with ID ${trainingId} not found.`);
      }
    },
    async sortSets(trainingId: string) {
      const training = this.trainings.find((t) => t.id === trainingId);

      if (training) {
        training.exerciseLogs.forEach((exerciseLog) => {
          exerciseLog.sets.sort((a, b) => a.order - b.order);
        });
      }
    },
    async loadTrainings() {
      const trainings = await getTrainings();
      this.trainings = trainings;
      if (trainings.length > 0) {
        this.currentTraining = trainings[0].id; // Set the first training as current by default
      } else {
        this.currentTraining = "";
      }
    },
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
    setTrainings(trainings: getTrainingResponseType[]) {
      this.trainings = trainings;
    },
    addExerciseLog(exerciseLog: exerciseLog) {
      const trainingId = exerciseLog.trainingId;
      const training = this.trainings.find((t) => t.id === trainingId);
      if (training) {
        training.exerciseLogs.push(exerciseLog);
      }
    },
    updateExerciseLog(exerciseLog: exerciseLog) {
      const trainingId = exerciseLog.trainingId;
      const training = this.trainings.find((t) => t.id === trainingId);
      if (training) {
        const index = training.exerciseLogs.findIndex((e) => e.id === exerciseLog.id);
        if (index !== -1) {
          training.exerciseLogs[index] = exerciseLog;
        } else {
          console.warn(`Exercise with ID ${exerciseLog.id} not found in training ${trainingId}.`);
        }
      } else {
        console.warn(`Training with ID ${trainingId} not found.`);
      }
    },
    removeExerciseLog(exerciseLogId: string) {
      for (const training of this.trainings) {
        const index = training.exerciseLogs.findIndex((e) => e.id === exerciseLogId);
        if (index !== -1) {
          training.exerciseLogs.splice(index, 1);
          return;
        }
      }
      console.warn(`Exercise with ID ${exerciseLogId} not found in any training.`);
    },
    addSet(set: set) {
      const exerciseLogId = set.exerciseLogId;
      const exercise = this.getExerciseLogById(exerciseLogId);
      if (exercise) {
        exercise.sets.push(set);
      } else {
        console.warn(`Exercise with ID ${exerciseLogId} not found.`);
      }
    },
    updateSet(set: set) {
      const exerciseLogId = set.exerciseLogId;
      const exercise = this.getExerciseLogById(exerciseLogId);
      if (exercise) {
        const index = exercise.sets.findIndex((s) => s.id === set.id);
        if (index !== -1) {
          exercise.sets[index] = set;
        } else {
          console.warn(`Set with ID ${set.id} not found in exercise ${exerciseLogId}.`);
        }
      } else {
        console.warn(`Exercise with ID ${exerciseLogId} not found.`);
      }
    },
    removeSet(setId: string) {
      for (const training of this.trainings) {
        for (const exercise of training.exerciseLogs) {
          const index = exercise.sets.findIndex((s) => s.id === setId);
          if (index !== -1) {
            exercise.sets.splice(index, 1);
            return;
          }
        }
      }
      console.warn(`Set with ID ${setId} not found in any exercise.`);
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
