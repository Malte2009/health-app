import { defineStore } from "pinia";
import WorkoutService from "@/services/workout/workout.service.ts";
import WorkoutSetService from "@/services/workout/workoutSet.service.ts";
import ExerciseService from "@/services/workout/exercise.service.ts";

export const useTypeStore = defineStore("typeStore", {
  state: () => ({
    workoutNames: [] as string[],
    setTypes: [] as string[],
    exerciseTypes: [] as string[],
    setRepUnitTypes: [] as string[],
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
    },
    async loadTypes() {
      this.workoutNames = await WorkoutService.getWorkoutNames();
      this.setTypes = await WorkoutSetService.getSetTypes();
      this.exerciseTypes = await ExerciseService.getExerciseNames() || [];
      this.setRepUnitTypes = await WorkoutSetService.getSetUnits();
    },
    checkTypes() {
      if (this.workoutNames.length === 0 || this.setTypes.length === 0 || this.exerciseTypes.length === 0 || this.setRepUnitTypes.length === 0) {
        this.loadTypes();
      }
    },
  },
});
