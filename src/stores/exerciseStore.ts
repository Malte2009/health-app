import { defineStore } from "pinia";
import type { exerciseType } from "@/types/exerciseType.ts";

export const useExerciseStore = defineStore("exerciseStore", {
  state: () => ({
    exercises: [] as Array<exerciseType>,
    exerciseNames: [] as Array<string>,
  }),

  actions: {
    setExercises(exercises: Array<exerciseType>) {
      this.exercises = exercises;
    },
    setExerciseNames(names: Array<string>) {
      this.exerciseNames = names;
    },
    updateExercise(oldName: string, exercise: exerciseType) {
      const index = this.exercises.findIndex((ex) => ex.name === oldName);

      if (index !== -1) {
        this.exercises[index] = exercise;
      }
    }
  },
  getters: {
    getExercises(state): Array<exerciseType> {
      return state.exercises;
    },
    getExerciseNames(state): Array<string> {
      return state.exerciseNames;
    },
    getExerciseByName: (state) => {
      return (name: string): exerciseType | undefined => {
        return state.exercises.find((exercise) => exercise.name === name);
      };
    }
  }
});
