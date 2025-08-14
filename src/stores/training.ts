import { defineStore } from "pinia";
import type { getTrainingResponseType } from "@/types/trainingType.ts";
import type { exercise } from "@/types/exerciseType.ts";
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
    getExerciseById: (state) => {
      return (exerciseId: string) => {
        return state.trainings.flatMap((training) => training.exercises).find((exercise) => exercise.id === exerciseId);
      };
    },
    getSetById: (state) => {
      return (setId: string) => {
        return state.trainings.flatMap((training) => training.exercises.flatMap((exercise) => exercise.sets)).find((set) => set.id === setId);
      };
    },
  },
  actions: {
    async sortExercieses(trainingId: string) {
      const training = this.trainings.find((t) => t.id === trainingId);
      if (training) {
        training.exercises.sort((a, b) => a.order - b.order);
      } else {
        console.warn(`Training with ID ${trainingId} not found.`);
      }
    },
    async loadTrainings() {
      const trainings = await getTrainings();
      if (trainings && trainings.length > 0) {
        this.currentTraining = trainings[0].id; // Set the first training as current by default
      } else {
        this.currentTraining = "";
      }
    },
    updateTraining(trainingId: string, training: getTrainingResponseType) {
      const index = this.trainings.findIndex((t) => t.id === trainingId);
      if (index !== -1) {
        this.trainings[index] = training;
      } else {
        console.warn(`Training with ID ${trainingId} not found.`);
      }
    },
    createTraining(training: getTrainingResponseType) {
      this.trainings.push(training);
    },
    setCurrentTraining(trainingId: string) {
      this.currentTraining = trainingId;
    },
    setTrainings(trainings: getTrainingResponseType[]) {
      this.trainings = trainings;
    },
    addExercise(exercise: exercise) {
      const trainingId = exercise.trainingId;
      const training = this.trainings.find((t) => t.id === trainingId);
      if (training) {
        training.exercises.push(exercise);
      }
    },
    updateExercise(exercise: exercise) {
      const trainingId = exercise.trainingId;
      const training = this.trainings.find((t) => t.id === trainingId);
      if (training) {
        const index = training.exercises.findIndex((e) => e.id === exercise.id);
        if (index !== -1) {
          training.exercises[index] = exercise;
        } else {
          console.warn(`Exercise with ID ${exercise.id} not found in training ${trainingId}.`);
        }
      } else {
        console.warn(`Training with ID ${trainingId} not found.`);
      }
    },
    removeExercise(exerciseId: string) {
      for (const training of this.trainings) {
        const index = training.exercises.findIndex((e) => e.id === exerciseId);
        if (index !== -1) {
          training.exercises.splice(index, 1);
          return;
        }
      }
      console.warn(`Exercise with ID ${exerciseId} not found in any training.`);
    },
    addSet(set: set) {
      const exerciseId = set.exerciseId;
      const exercise = this.getExerciseById(exerciseId);
      if (exercise) {
        exercise.sets.push(set);
      } else {
        console.warn(`Exercise with ID ${exerciseId} not found.`);
      }
    },
    updateSet(set: set) {
      const exerciseId = set.exerciseId;
      const exercise = this.getExerciseById(exerciseId);
      if (exercise) {
        const index = exercise.sets.findIndex((s) => s.id === set.id);
        if (index !== -1) {
          exercise.sets[index] = set;
        } else {
          console.warn(`Set with ID ${set.id} not found in exercise ${exerciseId}.`);
        }
      } else {
        console.warn(`Exercise with ID ${exerciseId} not found.`);
      }
    },
    removeSet(setId: string) {
      for (const training of this.trainings) {
        for (const exercise of training.exercises) {
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
    deleteTraining(trainingId: string) {
      this.trainings = this.trainings.filter((training) => training.id !== trainingId);
      if (this.currentTraining === trainingId) {
        this.currentTraining = "";
      }
    },
  },
});
