import { defineStore } from "pinia";
import WorkoutService from "@/services/trainingService.ts";
import WorkoutSetService from "@/services/setService.ts";
import ExerciseService from "@/services/training/exercise.service.ts";

export const useTypeStore = defineStore("typeStore", {
  state: () => ({
    trainingNames: [] as string[],
    setTypes: [] as string[],
    exerciseTypes: [] as string[],
    setRepUnitTypes: [] as string[],
  }),
  getters: {
    getTrainingNames: (state) => state.trainingNames,
    getSetTypes: (state) => state.setTypes,
    getExerciseTypes: (state) => state.exerciseTypes,
    getSetRepUnitTypes: (state) => state.setRepUnitTypes,
  },
  actions: {
    setTrainingNames(types: string[]) {
      this.trainingNames = types;
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
    addTrainingName(type: string) {
      if (!this.trainingNames.includes(type)) {
        this.trainingNames.push(type);
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
      this.trainingNames = [];
      this.setTypes = [];
    },
    async loadTypes() {
      this.trainingNames = await WorkoutService.getWorkoutNames();
      this.setTypes = await WorkoutSetService.getSetTypes();
      this.exerciseTypes = await ExerciseService.getExerciseNames() || [];
      this.setRepUnitTypes = await WorkoutSetService.getSetUnits();
    },
    checkTypes() {
      if (this.trainingNames.length === 0 || this.setTypes.length === 0 || this.exerciseTypes.length === 0 || this.setRepUnitTypes.length === 0) {
        this.loadTypes();
      }
    },
  },
});
