<template>
  <div class="training-view">
    <h1>Training Log</h1>
    <div class="training">
      <div class="board">
        <h2>Training Overview</h2>
        <div v-if="training">
          <p class="bold">Type: {{ training.type }}</p>
          <p v-if="training.duration" class="bold">Duration: {{ training.duration }} minutes</p>
          <p v-if="training.avgHeartRate" class="bold">Average Heart Rate: {{ training.avgHeartRate }} bpm</p>
          <p v-if="training.caloriesBurned" class="bold">Calories Burned: {{ training.caloriesBurned }}</p>
          <p>Date: {{ getDateString(training.createdAt) }}</p>
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
                <th>Exercises</th>
                <th v-for="sets in getSetRangeFromLongestExercise(training)" :key="sets">Set {{ sets }}</th>
              </tr>
              <tr
                :class="{ dragging: draggingExerciseIndex === index, focused: currentExerciseIndex === index }"
                v-for="(exercise, index) in training.exercises"
                :key="exercise.id"
              >
                <td
                  draggable="true"
                  @dragstart="onExerciseDragStart(index)"
                  @dragover.prevent="changeCurrentExerciseIndex(index)"
                  @dragend="
                    draggingExerciseIndex = null;
                    currentExerciseIndex = null;
                  "
                  @drop="onExerciseDrop(index)"
                  @contextmenu="exerciseContextMenu($event, exercise.id)"
                  @click="handleMobileEdit($event, exercise.id, 'exercise')"
                >
                  <div>{{ exercise.name }}</div>
                  <div v-if="exercise.notes">({{ exercise.notes }})</div>
                </td>
                <td
                  draggable="true"
                  @dragstart="onSetDragStart(setIndex, index)"
                  @dragover.prevent="changeCurrentSetIndex(setIndex, index)"
                  @dragend="
                    draggingSetIndex = null;
                    currentSetIndex = null;
                  "
                  @drop="onSetDrop(index, setIndex)"
                  :class="{
                    work: set.type === 'Work',
                    warmup: set.type === 'Warmup',
                    focused: currentSetIndex?.setIndex === setIndex && currentSetIndex?.index === index,
                    dragging: draggingSetIndex?.setIndex === setIndex && draggingSetIndex?.index === index,
                  }"
                  @contextmenu="setContextMenu($event, set.id)"
                  @click="handleMobileEdit($event, set.id, 'set')"
                  v-for="(set, setIndex) in exercise.sets"
                  :key="set.id"
                >
                  {{ set.reps }}{{ set.repUnit }} | {{ set.weight }}kg
                </td>
                <td @click="addSetToExercise(exercise.id)" class="add-Button">+</td>
              </tr>
              <tr>
                <td colspan="100%">
                  <button class="add-Exercise-Button" @click="addExerciseToTraining(trainingsId)">Add Exercise</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="addExercise" class="add-Exercise">
      <AddExercise @reload="reloadTraining()" @close="addExercise = false" :trainingId="trainingsId"></AddExercise>
    </div>

    <div v-if="changeExerciseCon" class="add-Exercise">
      <ChangeExercise @reload="reloadTraining()" @close="changeExerciseCon = false" :exerciseId="editExerciseId"></ChangeExercise>
    </div>

    <div v-if="addSet" class="add-Set">
      <AddSet @reload="reloadTraining()" @close="addSet = false" :exerciseId="selectedExerciseId"></AddSet>
    </div>

    <div v-if="changeSetCon" class="change-Set">
      <ChangeSet @reload="reloadTraining()" @close="changeSetCon = false" :setId="editSetId"></ChangeSet>
    </div>

    <div @focusout="closeExerciseContextMenu()" class="exercise-context-menu" tabindex="-1">
      <p @click="changeExercise()">Edit</p>
      <p
        @click="
          showConfirmDelete = true;
          hideContextMenu();
        "
      >
        Delete
      </p>
    </div>

    <div @focusout="closeSetContextMenu()" class="set-context-menu" tabindex="-1">
      <p @click="changeSet()">Edit</p>
      <p
        @click="
          showConfirmDelete = true;
          hideContextMenu();
        "
      >
        Delete
      </p>
    </div>

    <div v-if="showConfirmDelete" id="confirmDeleteModal" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to delete this training?</p>
        <button class="button button-danger" @click="confirmDelete()">Delete</button>
        <button class="button button-secondary" @click="cancelDelete()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useTrainingStore } from "@/stores/training.ts";
import { onMounted, ref } from "vue";
import AddExercise from "@/components/Exercise/AddExercise.vue";
import AddSet from "@/components/Set/AddSet.vue";
import ChangeSet from "@/components/Set/ChangeSet.vue";
import ChangeExercise from "@/components/Exercise/ChangeExercise.vue";
import type { getTrainingResponseType } from "@/types/trainingType.ts";
import { getTrainingById, updateTraining } from "@/services/trainingService.ts";
import { deleteExerciseRequest } from "@/services/exerciseService.ts";
import { deleteSetRequest } from "@/services/setService.ts";

const isMobile = window.innerWidth <= 768;

const trainingStore = useTrainingStore();
const router = useRouter();
const route = useRoute();

const trainingsId = route.params.id as string;
const training = ref(trainingStore.getTrainingById(trainingsId));

const addExercise = ref(false);
const changeExerciseCon = ref(false);
const addSet = ref(false);
const changeSetCon = ref(false);
const showConfirmDelete = ref(false);

const draggingExerciseIndex = ref<number | null>(null);
const currentExerciseIndex = ref<number | null>(null);

const draggingSetIndex = ref<{ setIndex: number; index: number } | null>(null);
const currentSetIndex = ref<{ setIndex: number; index: number } | null>(null);

const selectedExerciseId = ref<string>("");
const selectedSetId = ref<string>("");

const editExerciseId = ref<string>("");
const editSetId = ref<string>("");

function confirmDelete() {
  if (editExerciseId.value) {
    deleteExercise();
  } else if (editSetId.value) {
    deleteSet();
  }
  showConfirmDelete.value = false;
  editExerciseId.value = "";
  editSetId.value = "";
}

function cancelDelete() {
  showConfirmDelete.value = false;
  editExerciseId.value = "";
  editSetId.value = "";
}

function handleMobileEdit(event: MouseEvent, id: string, type: "exercise" | "set") {
  if (isMobile) {
    if (type === "exercise") {
      exerciseContextMenu(event, id);
    } else if (type === "set") {
      setContextMenu(event, id);
    }
  }
}

function changeCurrentSetIndex(setIndex: number, index: number) {
  if (draggingExerciseIndex.value != null && currentExerciseIndex.value != null) {
    currentExerciseIndex.value = index;
    return;
  }
  if (draggingSetIndex.value?.index != index) return;
  currentSetIndex.value = { setIndex, index };
}

function changeCurrentExerciseIndex(index: number) {
  if (draggingSetIndex.value) return;

  currentExerciseIndex.value = index;
}

function onExerciseDragStart(index: number) {
  if (draggingSetIndex.value) return;
  draggingExerciseIndex.value = index;
}

function onSetDragStart(setIndex: number, index: number) {
  if (draggingExerciseIndex.value != null && currentExerciseIndex.value != null) {
    return;
  }
  draggingSetIndex.value = { setIndex, index };
}

function onExerciseDrop(targetIndex: number) {
  if (draggingExerciseIndex.value === null || draggingExerciseIndex.value === targetIndex) {
    draggingExerciseIndex.value = null;
    return;
  }

  const moved = training.value?.exercises[draggingExerciseIndex.value];
  if (!moved || !training.value) {
    draggingExerciseIndex.value = null;
    return;
  }

  training.value.exercises.splice(draggingExerciseIndex.value, 1);

  training.value.exercises.splice(targetIndex, 0, moved);

  training.value.exercises.forEach((exercise, index) => {
    exercise.order = index;
  });

  trainingStore.changeTraining(trainingsId, training.value);

  updateTraining(trainingsId, training.value);

  draggingExerciseIndex.value = null;
}

function onSetDrop(targetExerciseIndex: number, targetSetIndex: number) {
  if (!draggingSetIndex.value || draggingSetIndex.value.setIndex === targetSetIndex) {
    draggingSetIndex.value = null;
    return;
  }

  const moved = training.value?.exercises[targetExerciseIndex].sets[draggingSetIndex.value.setIndex];
  if (!moved || !training.value) {
    draggingSetIndex.value = null;
    return;
  }

  training.value.exercises[targetExerciseIndex].sets.splice(draggingSetIndex.value.setIndex, 1);

  training.value.exercises[targetExerciseIndex].sets.splice(targetSetIndex, 0, moved);

  trainingStore.changeTraining(trainingsId, training.value);

  training.value.exercises[targetExerciseIndex].sets.forEach((set, index) => {
    set.order = index;
  });

  updateTraining(trainingsId, training.value);

  draggingSetIndex.value = null;
}

function getSetRangeFromLongestExercise(training: getTrainingResponseType): number[] {
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
  addSet.value = true;
  selectedExerciseId.value = exerciseId;
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
  editExerciseId.value = exerciseId;

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
  editSetId.value = setId;

  const menu = document.querySelector(".set-context-menu") as HTMLDivElement;
  if (menu) {
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.display = "block";
    menu.focus();
  }
}

function hideContextMenu() {
  const exerciseMenu = document.querySelector(".exercise-context-menu") as HTMLDivElement;
  const setMenu = document.querySelector(".set-context-menu") as HTMLDivElement;

  if (exerciseMenu) {
    exerciseMenu.style.display = "none";
  }
  if (setMenu) {
    setMenu.style.display = "none";
  }
}

async function changeExercise() {
  changeExerciseCon.value = true;

  hideContextMenu();

  await reloadTraining();
}

async function changeSet() {
  changeSetCon.value = true;

  hideContextMenu();

  await reloadTraining();
}

async function deleteExercise() {
  await deleteExerciseRequest(editExerciseId.value);
  editExerciseId.value = "";

  await reloadTraining();
}

async function deleteSet() {
  await deleteSetRequest(editSetId.value);
  editSetId.value = "";

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

function getDateString(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
  }).format(new Date(date));
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
.modal-content {
  background-color: var(--bg-surface);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

#confirmDeleteModal {
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

.button-secondary {
  background-color: var(--bg-surface-secondary);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.button-secondary:hover {
  background-color: var(--bg-surface);
  color: var(--text-main);
}

.button-danger {
  background-color: var(--danger);
  box-shadow: 0 2px 5px rgba(232, 63, 96, 0.2);
  color: var(--text-main);
}

.button-danger:hover {
  background-color: #e83f60;
}

.button {
  color: var(--text-main);
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition:
    background-color 0.2s,
    transform 0.1s;
  margin: 4px;
}

h1 {
  text-align: center;
  margin-top: 20px;
  color: var(--text-main);
}
.work {
  color: var(--color-set-work);
}

.warmup {
  color: var(--color-set-warmup);
}
.bold {
  font-weight: bold;
}
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

.add-Exercise-Button {
  background-color: var(--primary);
  color: var(--text-main);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.add-Exercise-Button:hover {
  background-color: #00a495;
}

.dragging {
  opacity: 0.5;
  background-color: #222;
}

.focused {
  outline: 2px solid var(--primary); /* oder einfach: #00a495 */
  background-color: #2a2a2a;
}

@media (max-width: 768px) {
  .training {
    flex-direction: column;
    width: fit-content;
    margin: 0 auto;
    align-items: center;
  }
  .board {
    margin-right: 0;
    margin-left: 0;
  }
}
</style>
