import { defineStore } from "pinia";
import WorkoutService from "@/services/workout/workout.service.ts";
import WorkoutSetService from "@/services/workout/workoutSet.service.ts";
import ExerciseService from "@/services/exercise/exercise.service.ts";

type TypeState = {
  workoutNames: string[];
  setTypes: string[];
  exerciseTypes: string[];
  setRepUnitTypes: string[];
  loaded: boolean;
  loadingPromise: Promise<void> | null;
};

export const useTypeStore = defineStore("typeStore", {
  state: (): TypeState => ({
    workoutNames: [],
    setTypes: [],
    exerciseTypes: [],
    setRepUnitTypes: [],
    loaded: false,
    loadingPromise: null,
  }),
  getters: {
    getWorkoutNames: (state) => state.workoutNames,
    getSetTypes: (state) => state.setTypes,
    getExerciseTypes: (state) => state.exerciseTypes,
    getSetRepUnitTypes: (state) => state.setRepUnitTypes,
  },
  actions: {
    setWorkoutNames(types: string[]) {
      this.workoutNames = types;
    },
    setSetTypes(types: string[]) {
      this.setTypes = types;
    },
    setExerciseTypes(types: string[]) {
      this.exerciseTypes = types;
    },
    setSetUnitTypes(types: string[]) {
      this.setRepUnitTypes = types;
    },
    addWorkoutName(type: string) {
      if (!this.workoutNames.includes(type)) {
        this.workoutNames.push(type);
      }
    },
    addSetType(type: string) {
      if (!this.setTypes.includes(type)) {
        this.setTypes.push(type);
      }
    },
    addExerciseType(type: string) {
      if (!this.exerciseTypes.includes(type)) {
        this.exerciseTypes.push(type);
      }
    },
    addSetUnitType(type: string) {
      if (!this.setRepUnitTypes.includes(type)) {
        this.setRepUnitTypes.push(type);
      }
    },
    clearTypes() {
      this.workoutNames = [];
      this.setTypes = [];
      this.exerciseTypes = [];
      this.setRepUnitTypes = [];
      this.loaded = false;
    },
    async loadTypes(force = false) {
      if (!force && this.loaded) return;
      if (!force && this.loadingPromise) return this.loadingPromise;

      this.loadingPromise = Promise.all([
        WorkoutService.getWorkoutNames(),
        WorkoutSetService.getSetTypes(),
        ExerciseService.getExerciseNames(),
        WorkoutSetService.getSetUnits(),
      ])
        .then(([workoutNames, setTypes, exerciseTypes, setRepUnitTypes]) => {
          this.workoutNames = workoutNames;
          this.setTypes = setTypes;
          this.exerciseTypes = exerciseTypes;
          this.setRepUnitTypes = setRepUnitTypes;
          this.loaded = true;
        })
        .finally(() => {
          this.loadingPromise = null;
        });

      return this.loadingPromise;
    },
    async checkTypes() {
      if (this.workoutNames.length === 0 || this.setTypes.length === 0 || this.exerciseTypes.length === 0 || this.setRepUnitTypes.length === 0) {
        await this.loadTypes();
      }
    },
  },
});
