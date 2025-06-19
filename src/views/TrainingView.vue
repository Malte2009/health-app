<template>
  <div class="training-view">
    <h1>Training Log</h1>
    <div class="training">
      <div class="board">
        <h2>Training Overview</h2>
        <div v-if="training">
          <p>Type: {{ training.type }}</p>
          <p>Duration: {{ training.durationMinutes }} minutes</p>
          <p>Average Heart Rate: {{ training.avgHeartRate }} bpm</p>
          <p>Date: {{ training.date }}</p>
          <p>Time: {{ training.time }}</p>
          <p>Calories Burned: {{ training.caloriesBurned }}</p>
          <p>Notes: {{ training.notes }}</p>
        </div>
      </div>
      <div class="board">
        <p v-if="!training">Loading...</p>
        <div v-else>
          <h2>Exercises</h2>
          <div>
            <table class="exercise-table">
              <tr>
                <th>Übungen</th>
                <th v-for="sets in getSetRangeFromLongestExercise(training)" :key="sets">
                  Satz {{ sets }}
                </th>
              </tr>
              <tr v-for="exercise in training.exercises" :key="exercise.id">
                <td @contextmenu="exerciseContextMenu($event, exercise.id)">{{ exercise.name }}</td>
                <td
                  @contextmenu="setContextMenu($event, set.id)"
                  v-for="set in exercise.sets"
                  :key="set.id"
                >
                  {{ set.reps }} Wdh. | {{ set.weight }} kg
                </td>
                <td @click="addSetToExercise(exercise.id)" class="add-Button">+</td>
              </tr>
              <tr>
                <td @click="addExerciseToTraining(trainingsId)" colspan="100%" class="add-Button">
                  +
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="addExercise" class="add-Exercise">
      <AddExercise
        @reload="reloadTraining()"
        @close="addExercise = false"
        :trainingId="trainingsId"
      ></AddExercise>
    </div>

    <div v-if="addSet" class="add-Set">
      <AddSet
        @reload="reloadTraining()"
        @close="addSet = false"
        :exerciseId="selectedExerciseId"
      ></AddSet>
    </div>

    <div v-if="changeSetCon" class="change-Set">
      <ChangeSet
        @reload="reloadTraining()"
        @close="changeSetCon = false"
        :setId="selectedSetId"
      ></ChangeSet>
    </div>

    <div @focusout="closeExerciseContextMenu()" class="exercise-context-menu" tabindex="-1">
      <p>Edit</p>
      <p @click="deleteExercise()">Delete</p>
    </div>

    <div @focusout="closeSetContextMenu()" class="set-context-menu" tabindex="-1">
      <p @click="changeSet()">Edit</p>
      <p @click="deleteSet()">Delete</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.ts";
import { useTrainingStore } from "@/stores/training.ts";
import { onMounted, ref } from "vue";
import AddExercise from "@/components/Exercise/AddExercise.vue";
import AddSet from "@/components/Set/AddSet.vue";
import ChangeSet from "@/components/Set/ChangeSet.vue";
import type { getTrainingResponse } from "@/types/trainingType.ts";
import { getTrainingById } from "@/services/trainingService.ts";
import { deleteExerciseRequest } from "@/services/exerciseService.ts";

const authStore = useAuthStore();
const trainingStore = useTrainingStore();
const router = useRouter();
const route = useRoute();

const trainingsId = route.params.id as string;
const training = ref(trainingStore.getTrainingById(trainingsId));

const addExercise = ref(false);
const addSet = ref(false);
const changeSetCon = ref(false);

const selectedExerciseId = ref<string>("");
const selectedSetId = ref<string>("");

function getSetRangeFromLongestExercise(training: getTrainingResponse): number[] {
  if (!training.exercises || training.exercises.length === 0) return [];

  let maxSetCount = 0;

  for (const exercise of training.exercises) {
    const setCount = exercise.sets?.length || 0;
    if (setCount > maxSetCount) {
      maxSetCount = setCount;
    }
  }

  return Array.from({ length: maxSetCount + 1 }, (_, i) => i + 1);
}

function addSetToExercise(exerciseId: string) {
  selectedExerciseId.value = exerciseId;
  addSet.value = true;
  console.log(`Add set to exercise with ID: ${exerciseId}`);
}

function addExerciseToTraining(trainingId: string) {
  addExercise.value = true;
  console.log(`Add new exercise to training with ID: ${trainingId}`);
}

async function reloadTraining() {
  const newTraining = await getTrainingById(trainingsId);

  if (!newTraining) return;
  trainingStore.changeTraining(trainingsId, newTraining);
  training.value = trainingStore.getTrainingById(trainingsId);
}

function exerciseContextMenu(event: MouseEvent, exerciseId: string) {
  event.preventDefault();
  // Logic to handle context menu for exercise
  selectedExerciseId.value = exerciseId;

  const menu = document.querySelector(".exercise-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.display = "block";
    menu.focus();
  }
}

function setContextMenu(event: MouseEvent, setId: string) {
  event.preventDefault();
  // Logic to handle context menu for set
  selectedSetId.value = setId;

  const menu = document.querySelector(".set-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.display = "block";
    menu.focus();
  }
}

async function changeExercise() {
  //TODO: Implement logic to change the exercise
  selectedExerciseId.value = "";
  const menu = document.querySelector(".exercise-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.display = "none";
  }

  await reloadTraining();
}

async function changeSet() {
  changeSetCon.value = true;
}

async function deleteExercise() {
  await deleteExerciseRequest(selectedExerciseId.value);
  selectedExerciseId.value = "";
  const menu = document.querySelector(".exercise-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.display = "none";
  }

  await reloadTraining();
}

async function deleteSet() {
  //TODO: Implement logic to delete the set
  selectedSetId.value = "";
  const menu = document.querySelector(".set-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.display = "none";
  }

  await reloadTraining();
}

function closeExerciseContextMenu() {
  const menu = document.querySelector(".exercise-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.display = "none";
  }
}

function closeSetContextMenu() {
  const menu = document.querySelector(".set-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.display = "none";
  }
}

onMounted(async () => {
  if (!training.value) {
    const getTraining = await getTrainingById(trainingsId);

    if (getTraining) {
      training.value = getTraining;
      trainingStore.addTraining(training.value);
    } else {
      await router.push({ name: "home" });
    }

    console.log(training);
  }
});
</script>

<style scoped>
.training {
  display: flex;
  flex-direction: row;
}
.board {
  background-color: var(--bg-surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width: fit-content;
  margin-right: 20px;
  margin-left: 20px;
}

.exercise-table {
  width: 100%;
  text-align: center;
  border: 1px solid #ccc;
  border-collapse: collapse;
}

.exercise-table th {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.exercise-table td {
  padding: 5px;
  border: 1px solid #ccc;
  border-collapse: collapse;
}

.exercise-table tr td {
  text-align: center;
  padding: 10px;
}

.add-Button {
  cursor: pointer;
  color: var(--success);
  font-weight: bold;
  min-width: 30px;
}

.add-Exercise {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-Set {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.change-Set {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.exercise-context-menu {
  position: absolute;
  background-color: var(--bg-surface);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none;
  outline: none;
}

.set-context-menu {
  position: absolute;
  background-color: var(--bg-surface);
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none;
  outline: none;
}

.exercise-context-menu p {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

.set-context-menu p {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}
</style>
