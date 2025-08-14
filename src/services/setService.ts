import api from "./api";
import type { changeSetRequestType, createSetRequestType, set } from "@/types/setType.ts";
import { useTypeStore } from "@/stores/type.ts";

export const getSetById = async (id: string): Promise<set | void> => {
  try {
    return (await api.get(`/set/getSet/${id}`)).data;
  } catch (error) {
    console.error(error);
  }
};

export const getSetTypes = async (): Promise<string[] | void> => {
  const typeStore = useTypeStore();
  try {
    const setTypes = (await api.get(`/set/getSetTypes`)).data;
    typeStore.setSetTypes(setTypes);
    return setTypes;
  } catch (error) {
    console.error(error);
  }
};

export const getSetUnits = async (): Promise<string[] | void> => {
  const typeStore = useTypeStore();
  try {
    const setUnits = (await api.get(`/set/getSetUnits`)).data;
    typeStore.setSetUnitTypes(setUnits);
    return setUnits;
  } catch (error) {
    console.error(error);
  }
};

export const changeSetRequest = async (set: changeSetRequestType): Promise<set | void> => {
  try {
    return (await api.patch(`/set/changeSet/${set.id}`, set)).data;
  } catch (error) {
    console.error(error);
  }
};

export const createSetRequest = async (set: createSetRequestType): Promise<set | void> => {
  try {
    return (await api.put(`/set/createSet`, set)).data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteSetRequest = async (setId: string): Promise<void> => {
  try {
    await api.delete(`/set/deleteSet/${setId}`);
  } catch (error) {
    console.error(error);
  }
};
