import { createEvent, createStore } from "effector";
import { setState } from "./utils";

const setErrors = createEvent<Record<string, any>>('setErrors');

export const $errors = createStore<Record<string, any>>({}).on(setErrors, setState)

export const $errorActions = {
  setErrors,
}