import { defineStore } from "pinia";
import { getTrainingNames } from "@/services/trainingService.ts";
import { getSetTypes, getSetUnits } from "@/services/setService.ts";
import { getExerciseNames } from "@/services/exerciseService.ts";

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
      this.trainingNames = await getTrainingNames();
      this.setTypes = await getSetTypes();
      this.exerciseTypes = await getExerciseNames() || [];
      this.setRepUnitTypes = await getSetUnits();
    },
    checkTypes() {
      if (this.trainingNames.length === 0 || this.setTypes.length === 0 || this.exerciseTypes.length === 0 || this.setRepUnitTypes.length === 0) {
        this.loadTypes();
      }
    },
  },
});
