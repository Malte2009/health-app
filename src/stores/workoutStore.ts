import { defineStore } from "pinia";
import WorkoutService from "@/services/workout/workout.service.ts";
import type { Workout } from "@/types/workout/workout.type.ts";
import type { WorkoutExercise } from "@/types/workout/workoutExercise.type.ts";
import type { WorkoutSet } from "@/types/workout/workoutSet.type.ts";

export const useWorkoutStore = defineStore("workoutStore", {
  state: () => ({
    workouts: [] as Workout[],
    currentWorkout: "",
  }),
  getters: {
    getWorkouts: (state) => state.workouts,
    getCurrentWorkout: (state) => state.currentWorkout,
    getWorkoutById: (state) => {
      return (id: string) => state.workouts.find((workout) => workout.id === id);
    },
    getWorkoutExerciseById: (state) => {
      return (workoutExerciseId: string) => {
        return state.workouts
          .flatMap((workout) => workout.workoutExercises ?? [])
          .find((workoutExercise) => workoutExercise.id === workoutExerciseId);
      };
    },
    getWorkoutSetById: (state) => {
      return (setId: string) => {
        return state.workouts
          .flatMap((workout) => (workout.workoutExercises ?? []).flatMap((workoutExercise) => workoutExercise.workoutSets ?? []))
          .find((set) => set.id === setId);
      };
    },
  },
  actions: {
    async sortWorkoutExercises(workoutId: string) {
      const workout = this.workouts.find((t) => t.id === workoutId);
      if (workout) {
        workout.workoutExercises?.sort((a, b) => a.order - b.order);
      } else {
        console.warn(`Workout with ID ${workoutId} not found.`);
      }
    },
    async sortWorkoutSets(workoutId: string) {
      const workout = this.workouts.find((t) => t.id === workoutId);

      if (workout) {
        workout.workoutExercises?.forEach((workoutExercise) => {
          workoutExercise.workoutSets?.sort((a, b) => a.order - b.order);
        });
      }
    },
    async loadWorkouts() {
      const workouts = await WorkoutService.getWorkouts();
      this.workouts = workouts;
      if (workouts.length > 0) {
        this.currentWorkout = workouts[0].id; // Set the first workout as current by default
      } else {
        this.currentWorkout = "";
      }
    },
    changeWorkout(workoutId: string, workout: Workout) {
      const index = this.workouts.findIndex((t) => t.id === workoutId);
      if (index !== -1) {
        this.workouts[index] = {
          ...this.workouts[index],
          ...workout,
          workoutExercises: workout.workoutExercises ?? this.workouts[index].workoutExercises,
        };
      } else {
        console.warn(`Workout with ID ${workoutId} not found.`);
      }
    },
    addWorkout(workout: Workout) {
      const index = this.workouts.findIndex((existingTraining) => existingTraining.id === workout.id);
      if (index === -1) {
        this.workouts.push(workout);
      } else {
        this.workouts[index] = {
          ...this.workouts[index],
          ...workout,
          workoutExercises: workout.workoutExercises ?? this.workouts[index].workoutExercises,
        };
      }
    },
    setCurrentWorkout(workoutId: string) {
      this.currentWorkout = workoutId;
    },
    setWorkouts(workouts: Workout[]) {
      this.workouts = workouts;
    },
    setWorkoutExercises(workoutId: string, workoutExercises: WorkoutExercise[]) {
      const workout = this.workouts.find((t) => t.id === workoutId);
      if (workout) {
        workout.workoutExercises = workoutExercises;
      } else {
        console.warn(`Workout with ID ${workoutId} not found.`);
      }
    },
    addWorkoutExercise(workoutExercise: WorkoutExercise) {
      const workoutId = workoutExercise.workoutId;
      const workout = this.workouts.find((t) => t.id === workoutId);
      if (workout) {
        (workout.workoutExercises ??= []).push(workoutExercise);
      }
    },
    updateWorkoutExercise(workoutExercise: WorkoutExercise) {
      const workoutId = workoutExercise.workoutId;
      const workout = this.workouts.find((t) => t.id === workoutId);
      if (workout) {
        const index = workout.workoutExercises?.findIndex((e) => e.id === workoutExercise.id) ?? -1;
        if (index !== -1) {
          const currentWorkoutExercise = workout.workoutExercises![index];
          workout.workoutExercises![index] = {
            ...currentWorkoutExercise,
            ...workoutExercise,
            workoutSets: workoutExercise.workoutSets ?? currentWorkoutExercise.workoutSets,
          };
        } else {
          console.warn(`Exercise with ID ${workoutExercise.id} not found in workout ${workoutId}.`);
        }
      } else {
        console.warn(`Workout with ID ${workoutId} not found.`);
      }
    },
    removeWorkoutExercise(workoutExerciseId: string) {
      for (const workout of this.workouts) {
        const index = workout.workoutExercises?.findIndex((e) => e.id === workoutExerciseId) ?? -1;
        if (index !== -1) {
          workout.workoutExercises!.splice(index, 1);
          return;
        }
      }
      console.warn(`Exercise with ID ${workoutExerciseId} not found in any workout.`);
    },
    addWorkoutSet(set: WorkoutSet) {
      const workoutExerciseId = set.workoutExerciseId;
      const exercise = this.getWorkoutExerciseById(workoutExerciseId);
      if (exercise) {
        (exercise.workoutSets ??= []).push(set);
      } else {
        console.warn(`Exercise with ID ${workoutExerciseId} not found.`);
      }
    },
    updateWorkoutSet(set: WorkoutSet) {
      const workoutExerciseId = set.workoutExerciseId;
      const exercise = this.getWorkoutExerciseById(workoutExerciseId);
      if (exercise) {
        const index = exercise.workoutSets?.findIndex((s) => s.id === set.id) ?? -1;
        if (index !== -1) {
          exercise.workoutSets![index] = set;
        } else {
          console.warn(`Set with ID ${set.id} not found in exercise ${workoutExerciseId}.`);
        }
      } else {
        console.warn(`Exercise with ID ${workoutExerciseId} not found.`);
      }
    },
    removeWorkoutSet(setId: string) {
      for (const workout of this.workouts) {
        for (const exercise of workout.workoutExercises ?? []) {
          const index = exercise.workoutSets?.findIndex((s) => s.id === setId) ?? -1;
          if (index !== -1) {
            exercise.workoutSets!.splice(index, 1);
            return;
          }
        }
      }
      console.warn(`Set with ID ${setId} not found in any exercise.`);
    },
    clearWorkouts() {
      this.workouts = [];
      this.currentWorkout = "";
    },
    removeWorkout(workoutId: string) {
      this.workouts = this.workouts.filter((workout) => workout.id !== workoutId);
      if (this.currentWorkout === workoutId) {
        this.currentWorkout = "";
      }
    },
  },
});
