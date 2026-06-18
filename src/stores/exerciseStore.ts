import { defineStore } from "pinia";
import type { Exercise } from "@/types/exerciseType.ts";

export const useExerciseStore = defineStore("exerciseStore", {
  state: () => ({
    exercises: [] as Array<Exercise>,
    exerciseNames: [] as Array<string>,
  }),

  actions: {
    setExercises(exercises: Array<Exercise>) {
      this.exercises = exercises;
    },
    setExerciseNames(names: Array<string>) {
      this.exerciseNames = names;
    },
    updateExercise(id: string, exercise: Exercise) {
      const index = this.exercises.findIndex((ex) => ex.id === id);

      if (index !== -1) {
        this.exercises[index] = exercise;
      }
    }
  },
  getters: {
    getExercises(state): Array<Exercise> {
      return state.exercises;
    },
    getExerciseNames(state): Array<string> {
      return state.exerciseNames;
    },
    getExerciseByName: (state) => {
      return (name: string): Exercise | undefined => {
        return state.exercises.find((exercise) => exercise.name === name);
      };
    },
    getExerciseById: (state) => {
      return (id: string): Exercise | undefined => {
        return state.exercises.find((exercise) => exercise.id === id);
      };
    },
  }
});
