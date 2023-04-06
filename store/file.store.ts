import { createEvent, createStore } from "effector";
import { setState } from './utils';

const setSlideFile = createEvent<any>('setSlideFile');

export const $slideFile = createStore<any>(null).on(setSlideFile, setState)

export const $fileActions = {
  setSlideFile,
}