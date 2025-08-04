import { defineStore } from "pinia";
import { getTrainingTypes } from "@/services/trainingService.ts";
import { getSetTypes, getSetUnits } from "@/services/setService.ts";
import { getExerciseNames } from "@/services/exerciseService.ts";

export const useTypeStore = defineStore("typeStore", {
  state: () => ({
    trainingTypes: [] as string[],
    setTypes: [] as string[],
    exerciseTypes: [] as string[],
    setRepUnitTypes: [] as string[],
  }),
  getters: {
    getTrainingTypes: (state) => state.trainingTypes,
    getSetTypes: (state) => state.setTypes,
    getExerciseTypes: (state) => state.exerciseTypes,
    getSetRepUnitTypes: (state) => state.setRepUnitTypes,
  },
  actions: {
    setTrainingTypes(types: string[]) {
      this.trainingTypes = types;
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
    clearTypes() {
      this.trainingTypes = [];
      this.setTypes = [];
    },
    async loadTypes() {
      this.trainingTypes = await getTrainingTypes();
      this.setTypes = await getSetTypes();
      this.exerciseTypes = await getExerciseNames();
      this.setRepUnitTypes = await getSetUnits();
    },
  },
});
