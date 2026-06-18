<template>
  <div class="workout-view">
    <h1>Workout</h1>
    <div class="workout">
      <div class="board">
        <h2>Workout Overview</h2>
        <div v-if="workout">
          <p class="bold">Name: {{ workout.name }}</p>
          <p v-if="workout.duration" class="bold">Length: {{ formatWorkoutLength(workout.duration) }}</p>
          <p v-if="workout.avgHeartRate" class="bold">Average Heart Rate: {{ workout.avgHeartRate }} bpm</p>
          <p v-if="workout.caloriesBurned" class="bold">Calories Burned: {{ workout.caloriesBurned }} kcal</p>
          <p>Date: {{ getDateString(workout.createdAt) }}</p>
          <p>Notes: {{ workout.notes }}</p>
        </div>
      </div>
      <div class="board">
        <p v-if="!workout">Loading...</p>
        <div v-else>
          <h2>Exercises</h2>
          <div>
            <table class="exercise-table">
              <tr>
                <th>Exercises</th>
                <th v-for="sets in getHeadingNames(workout)" :key="sets">{{ sets }}</th>
              </tr>
              <tr
                :class="{ dragging: draggingExerciseIndex === index, focused: currentExerciseIndex === index }"
                v-for="(exercise, index) in workout.workoutExercises ?? []"
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
                  <div>{{ exercise?.exercise?.name }}</div>
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
                  v-for="(set, setIndex) in exercise.workoutSets"
                  :key="set.id"
                >
                  <p v-if="set?.type != 'Pause'">{{ set.reps + set.repUnit}} | {{ set.weight }}kg</p>
                  <p v-if="set?.type === 'Pause'">{{ set.reps + set.repUnit }}</p>
                </td>
                <td @click="addSetToExercise(exercise.id)" class="add-Button">+</td>
              </tr>
              <tr>
                <td colspan="100%">
                  <button class="add-Exercise-Button" @click="addExerciseToWorkout(workoutId)">Add Exercise</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="addWorkoutExercise" class="add-Exercise">
      <AddExercise
        @close="
          addWorkoutExercise = false;
          reloadWorkoutFromStore();
        "
        :workoutId="workoutId"
      ></AddExercise>
    </div>

    <div v-if="changeWorkoutExerciseCon" class="add-Exercise">
      <ChangeExercise
        @close="
          changeWorkoutExerciseCon = false;
          reloadWorkoutFromStore();
        "
        :workoutId="workoutId"
        :workoutExerciseId="editWorkoutExerciseId"
      ></ChangeExercise>
    </div>

    <div v-if="addWorkoutSet" class="add-Set">
      <AddSet
        @close="
          addWorkoutSet = false;
          reloadWorkoutFromStore();
        "
        :workoutId="workoutId"
        :workoutExerciseId="selectedWorkoutExerciseId"
      ></AddSet>
    </div>

    <div v-if="changeSetCon" class="change-Set">
      <ChangeSet
        @close="
          changeSetCon = false;
          reloadWorkoutFromStore();
        "
        :workoutId="workoutId"
        :workoutExerciseId="editSetWorkoutExerciseId"
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
        <p>Are you sure you want to delete this workout?</p>
        <button class="button button-danger" @click="confirmDelete()">Delete</button>
        <button class="button button-secondary" @click="cancelDelete()">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useWorkoutStore } from "@/stores/workoutStore.ts";
import { onBeforeMount, ref } from "vue";
import AddExercise from "@/components/Exercise/AddExercise.vue";
import AddSet from "@/components/Set/AddSet.vue";
import ChangeSet from "@/components/Set/ChangeSet.vue";
import ChangeExercise from "@/components/Exercise/ChangeExercise.vue";
import type { Workout } from "@/types/workout/workout.type.ts";
import WorkoutService from "@/services/workout/workout.service";
import WorkoutExerciseService from "@/services/workout/workoutExercise.service.ts";
import WorkoutSetService from "@/services/workout/workoutSet.service.ts";
import { useTypeStore } from "@/stores/type.ts";
import { getDateString } from "@/utility/date.ts";

const isMobile = window.innerWidth <= 768;

const workoutStore = useWorkoutStore();
const typeStore = useTypeStore();
const router = useRouter();
const route = useRoute();

const workoutId = route.params.id as string;
const workout = ref(workoutStore.getWorkoutById(workoutId));

const addWorkoutExercise = ref(false);
const changeWorkoutExerciseCon = ref(false);
const addWorkoutSet = ref(false);
const changeSetCon = ref(false);
const showConfirmDelete = ref(false);

const draggingExerciseIndex = ref<number | null>(null);
const currentExerciseIndex = ref<number | null>(null);

const draggingSetIndex = ref<{ setIndex: number; index: number } | null>(null);
const currentSetIndex = ref<{ setIndex: number; index: number } | null>(null);

const selectedWorkoutExerciseId = ref<string>("");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectedSetId = ref<string>("");

const editWorkoutExerciseId = ref<string>("");
const editSetId = ref<string>("");
const editSetWorkoutExerciseId = ref<string>("");

const formatWorkoutLength = (duration: number): string => {
  const minutes = duration > 600 ? Math.round(duration / 60) : duration;
  return `${minutes} minutes`;
};

function confirmDelete() {
  if (editWorkoutExerciseId.value) {
    deleteExercise();
  } else if (editSetId.value) {
    deleteWorkoutSet();
  }
  showConfirmDelete.value = false;
  editWorkoutExerciseId.value = "";
  editSetId.value = "";
  editSetWorkoutExerciseId.value = "";
}

function cancelDelete() {
  showConfirmDelete.value = false;
  editWorkoutExerciseId.value = "";
  editSetId.value = "";
  editSetWorkoutExerciseId.value = "";
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

  const workoutExercises = workout.value?.workoutExercises;
  const moved = workoutExercises?.[draggingExerciseIndex.value];
  if (!moved || !workout.value || !workoutExercises) {
    draggingExerciseIndex.value = null;
    return;
  }

  workoutExercises.splice(draggingExerciseIndex.value, 1);

  workoutExercises.splice(targetIndex, 0, moved);

  workoutExercises.forEach((workoutExercise, index) => {
    workoutExercise.order = index;
  });

  workoutStore.changeWorkout(workoutId, workout.value);

  workoutExercises.forEach((workoutExercise) => {
    WorkoutExerciseService.updateWorkoutExercise(workoutId, workoutExercise.id, {
      order: workoutExercise.order,
    });
  });

  draggingExerciseIndex.value = null;
}

function onSetDrop(targetExerciseIndex: number, targetSetIndex: number) {
  if (!draggingSetIndex.value || draggingSetIndex.value.setIndex === targetSetIndex) {
    draggingSetIndex.value = null;
    return;
  }

  const workoutExercise = workout.value?.workoutExercises?.[targetExerciseIndex];
  const workoutSets = workoutExercise?.workoutSets;
  const moved = workoutSets?.[draggingSetIndex.value.setIndex];
  if (!moved || !workout.value || !workoutExercise) {
    draggingSetIndex.value = null;
    return;
  }

  workoutSets.splice(draggingSetIndex.value.setIndex, 1);

  workoutSets.splice(targetSetIndex, 0, moved);

  workoutStore.changeWorkout(workoutId, workout.value);

  workoutSets.forEach((set, index) => {
    set.order = index;
  });

  workoutSets.forEach((set, index) => {
    WorkoutSetService.updateWorkoutSet(workoutId, workoutExercise.id, set.id, {
      order: index,
    });
  });

  draggingSetIndex.value = null;
}

function getHeadingNames(workout: Workout): string[] {
  if (!workout.workoutExercises || workout.workoutExercises.length === 0) return [];

  let maxSetCount = 0;

  for (const exercise of workout.workoutExercises) {
    const setCount = exercise.workoutSets?.length || 0;
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
  addWorkoutSet.value = true;
  selectedWorkoutExerciseId.value = exerciseId;
  console.log(`Add set to exercise with ID: ${exerciseId}`);
}

function addExerciseToWorkout(workoutId: string) {
  addWorkoutExercise.value = true;
  console.log(`Add new exercise to workout with ID: ${workoutId}`);
}

function exerciseContextMenu(event: MouseEvent, exerciseId: string) {
  event.preventDefault();
  // Logic to handle context menu for exercise
  editWorkoutExerciseId.value = exerciseId;

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
  editSetWorkoutExerciseId.value =
    workout.value?.workoutExercises?.find((exercise) => exercise.workoutSets?.some((set) => set.id === setId))?.id || "";

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
  changeWorkoutExerciseCon.value = true;

  hideContextMenu();
}

async function changeSet() {
  changeSetCon.value = true;

  hideContextMenu();
}

async function deleteExercise() {
  workoutStore.removeWorkoutExercise(editWorkoutExerciseId.value);
  await WorkoutExerciseService.deleteWorkoutExercise(workoutId, editWorkoutExerciseId.value);
  editWorkoutExerciseId.value = "";
}

async function deleteWorkoutSet() {
  workoutStore.removeWorkoutSet(editSetId.value);
  await WorkoutSetService.deleteWorkoutSet(workoutId, editSetWorkoutExerciseId.value, editSetId.value);
  editSetId.value = "";
  editSetWorkoutExerciseId.value = "";
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

function reloadWorkoutFromStore() {
  workout.value = workoutStore.getWorkoutById(workoutId);
  if (!workout.value) {
    router.push({ name: "home" });
  }
}

async function loadWorkoutDetails() {
  const getWorkout = await WorkoutService.getWorkoutById(workoutId, false, false);

  if (getWorkout) {
    workoutStore.addWorkout(getWorkout);
  } else if (!workout.value) {
    await router.push({ name: "home" });
    return;
  }

  const workoutExercises = await WorkoutExerciseService.getWorkoutExercises(workoutId, true);
  workoutStore.setWorkoutExercises(workoutId, workoutExercises);
  workout.value = workoutStore.getWorkoutById(workoutId);
}

onBeforeMount(async () => {
  typeStore.checkTypes();
  await loadWorkoutDetails();
  if (workout.value) {
    await workoutStore.sortWorkoutExercises(workout.value.id);
    await workoutStore.sortWorkoutSets(workout.value.id);
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
.workout {
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
  .workout {
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
