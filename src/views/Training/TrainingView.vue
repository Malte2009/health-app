<template>
  <div class="training-view">
    <h1>Training Log</h1>
    <div class="training">
      <div class="board">
        <h2>Training Overview</h2>
        <div v-if="training">
          <p class="bold">Name: {{ training.name }}</p>
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
                <th v-for="sets in getHeadingNames(training)" :key="sets">{{ sets }}</th>
              </tr>
              <tr
                :class="{ dragging: draggingExerciseIndex === index, focused: currentExerciseIndex === index }"
                v-for="(exercise, index) in training.exerciseLogs"
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
                    pause: set.type === 'Pause',
                    focused: currentSetIndex?.setIndex === setIndex && currentSetIndex?.index === index,
                    dragging: draggingSetIndex?.setIndex === setIndex && draggingSetIndex?.index === index,
                  }"
                  @contextmenu="setContextMenu($event, set.id)"
                  @click="handleMobileEdit($event, set.id, 'set')"
                  v-for="(set, setIndex) in exercise.sets"
                  :key="set.id"
                >
                  <p v-if="set?.type != 'Pause'">{{ set.reps + set.repUnit}} | {{ set.weight }}kg</p>
                  <p v-if="set?.type === 'Pause'">{{ set.reps + set.repUnit }}</p>
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

    <div v-if="addExerciseLog" class="add-Exercise">
      <AddExercise
        @close="
          addExerciseLog = false;
          reloadTrainingFromStore();
        "
        :trainingId="trainingsId"
      ></AddExercise>
    </div>

    <div v-if="changeExerciseLogCon" class="add-Exercise">
      <ChangeExercise
        @close="
          changeExerciseLogCon = false;
          reloadTrainingFromStore();
        "
        :exerciseLogId="editExerciseLogId"
      ></ChangeExercise>
    </div>

    <div v-if="addSet" class="add-Set">
      <AddSet
        @close="
          addSet = false;
          reloadTrainingFromStore();
        "
        :exerciseLogId="selectedExerciseLogId"
      ></AddSet>
    </div>

    <div v-if="changeSetCon" class="change-Set">
      <ChangeSet
        @close="
          changeSetCon = false;
          reloadTrainingFromStore();
        "
        :setId="editSetId"
      ></ChangeSet>
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
import { useTrainingStore } from "@/stores/trainingStore.ts";
import { onBeforeMount, ref } from "vue";
import AddExercise from "@/components/Exercise/AddExercise.vue";
import AddSet from "@/components/Set/AddSet.vue";
import ChangeSet from "@/components/Set/ChangeSet.vue";
import ChangeExercise from "@/components/Exercise/ChangeExercise.vue";
import type { getTrainingResponseType } from "@/types/trainingType.ts";
import { getTrainingById, updateTraining } from "@/services/trainingService.ts";
import { deleteExerciseLogRequest } from "@/services/exerciseLogService.ts";
import { deleteSetRequest } from "@/services/setService.ts";
import { useTypeStore } from "@/stores/type.ts";
import { getDateString } from "@/utility/date.ts";

const isMobile = window.innerWidth <= 768;

const trainingStore = useTrainingStore();
const typeStore = useTypeStore();
const router = useRouter();
const route = useRoute();

const trainingsId = route.params.id as string;
const training = ref(trainingStore.getTrainingById(trainingsId));

const addExerciseLog = ref(false);
const changeExerciseLogCon = ref(false);
const addSet = ref(false);
const changeSetCon = ref(false);
const showConfirmDelete = ref(false);

const draggingExerciseIndex = ref<number | null>(null);
const currentExerciseIndex = ref<number | null>(null);

const draggingSetIndex = ref<{ setIndex: number; index: number } | null>(null);
const currentSetIndex = ref<{ setIndex: number; index: number } | null>(null);

const selectedExerciseLogId = ref<string>("");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectedSetId = ref<string>("");

const editExerciseLogId = ref<string>("");
const editSetId = ref<string>("");

function confirmDelete() {
  if (editExerciseLogId.value) {
    deleteExercise();
  } else if (editSetId.value) {
    deleteSet();
  }
  showConfirmDelete.value = false;
  editExerciseLogId.value = "";
  editSetId.value = "";
}

function cancelDelete() {
  showConfirmDelete.value = false;
  editExerciseLogId.value = "";
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

  const moved = training.value?.exerciseLogs[draggingExerciseIndex.value];
  if (!moved || !training.value) {
    draggingExerciseIndex.value = null;
    return;
  }

  training.value.exerciseLogs.splice(draggingExerciseIndex.value, 1);

  training.value.exerciseLogs.splice(targetIndex, 0, moved);

  training.value.exerciseLogs.forEach((exerciseLog, index) => {
    exerciseLog.order = index;
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

  const moved = training.value?.exerciseLogs[targetExerciseIndex].sets[draggingSetIndex.value.setIndex];
  if (!moved || !training.value) {
    draggingSetIndex.value = null;
    return;
  }

  training.value.exerciseLogs[targetExerciseIndex].sets.splice(draggingSetIndex.value.setIndex, 1);

  training.value.exerciseLogs[targetExerciseIndex].sets.splice(targetSetIndex, 0, moved);

  trainingStore.changeTraining(trainingsId, training.value);

  training.value.exerciseLogs[targetExerciseIndex].sets.forEach((set, index) => {
    set.order = index;
  });

  updateTraining(trainingsId, training.value);

  draggingSetIndex.value = null;
}

function getHeadingNames(training: getTrainingResponseType): string[] {
  if (!training.exerciseLogs || training.exerciseLogs.length === 0) return [];

  let maxSetCount = 0;

  for (const exercise of training.exerciseLogs) {
    const setCount = exercise.sets?.length || 0;
    if (setCount > maxSetCount) {
      maxSetCount = setCount;
    }
  }

  const nameArray: string[] = [];

  for (let i = 1; i <= maxSetCount; i++) {
    if (i % 2 === 0) {
      nameArray.push("Pause " + i / 2);
    } else {
      nameArray.push("Set " + Math.ceil(i / 2));
    }
  }

  return nameArray;
}

function addSetToExercise(exerciseId: string) {
  addSet.value = true;
  selectedExerciseLogId.value = exerciseId;
  console.log(`Add set to exercise with ID: ${exerciseId}`);
}

function addExerciseToTraining(trainingId: string) {
  addExerciseLog.value = true;
  console.log(`Add new exercise to training with ID: ${trainingId}`);
}

function exerciseContextMenu(event: MouseEvent, exerciseId: string) {
  event.preventDefault();
  // Logic to handle context menu for exercise
  editExerciseLogId.value = exerciseId;

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
  changeExerciseLogCon.value = true;

  hideContextMenu();
}

async function changeSet() {
  changeSetCon.value = true;

  hideContextMenu();
}

async function deleteExercise() {
  trainingStore.removeExerciseLog(editExerciseLogId.value);
  await deleteExerciseLogRequest(editExerciseLogId.value);
  editExerciseLogId.value = "";
}

async function deleteSet() {
  trainingStore.removeSet(editSetId.value);
  await deleteSetRequest(editSetId.value);
  editSetId.value = "";
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

function reloadTrainingFromStore() {
  training.value = trainingStore.getTrainingById(trainingsId);
  if (!training.value) {
    router.push({ name: "home" });
  }
}

onBeforeMount(async () => {
  typeStore.checkTypes();
  if (!training.value) {
    const getTraining = await getTrainingById(trainingsId);

    if (getTraining) {
      training.value = getTraining;
      trainingStore.addTraining(training.value);
    } else {
      await router.push({ name: "home" });
    }
  }
  if (training.value) {
    await trainingStore.sortExerciseLogs(training.value.id);
    await trainingStore.sortSets(training.value.id);
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
