import { defineStore } from "pinia";
import type { Exercise } from "@/types/exerciseType.ts";
import ExerciseService from "@/services/exercise/exercise.service.ts";

export const useExerciseStore = defineStore("exerciseStore", {
  state: () => ({
    exercises: [] as Array<Exercise>,
    exerciseNames: [] as Array<string>,
    exercisesLoaded: false,
    exercisesLoadingPromise: null as Promise<Exercise[]> | null,
  }),

  actions: {
    setExercises(exercises: Array<Exercise>) {
      this.exercises = exercises;
      this.exercisesLoaded = true;
    },
    setExerciseNames(names: Array<string>) {
      this.exerciseNames = names;
    },
    async loadExercises(force = false): Promise<Exercise[]> {
      if (!force && this.exercisesLoaded) return this.exercises;
      if (!force && this.exercisesLoadingPromise) return this.exercisesLoadingPromise;

      this.exercisesLoadingPromise = ExerciseService.getAllExercises()
        .then((exercises) => {
          this.setExercises(exercises);
          return exercises;
        })
        .finally(() => {
          this.exercisesLoadingPromise = null;
        });

      return this.exercisesLoadingPromise;
    },
    updateExercise(id: string, exercise: Exercise) {
      const index = this.exercises.findIndex((ex) => ex.id === id);

      if (index !== -1) {
        this.exercises[index] = exercise;
      }
    },
    removeExercise(id: string) {
      this.exercises = this.exercises.filter((exercise) => exercise.id !== id);
    },
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
