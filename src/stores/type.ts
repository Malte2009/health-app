import { defineStore } from "pinia";
import { getTrainingTypes } from "@/services/trainingService.ts";
import { getSetTypes } from "@/services/setService.ts";
import { getExerciseNames } from "@/services/exerciseService.ts";

export const useTypeStore = defineStore("typeStore", {
  state: () => ({
    trainingTypes: [] as string[],
    setTypes: [] as string[],
    exerciseTypes: [] as string[]
  }),
  getters: {
    getTrainingTypes: (state) => state.trainingTypes,
    getSetTypes: (state) => state.setTypes,
    getExerciseTypes: (state) => state.exerciseTypes,
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
    clearTypes() {
      this.trainingTypes = [];
      this.setTypes = [];
    },
    async loadTypes() {
      this.trainingTypes = await getTrainingTypes();
      this.setTypes = await getSetTypes();
      this.exerciseTypes = await getExerciseNames();
    }
  },
}
);
