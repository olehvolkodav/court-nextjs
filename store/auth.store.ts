import { createEvent, createStore } from "effector";
import { setState } from "./utils";

export const setUser = createEvent<any>("setUser");
export const updateUser = createEvent<any>("updateUser")
export const setUserLoaded = createEvent<boolean>("setUsetLoaded")

export const $user = createStore<Record<string, any>>(null as any)
  .on(setUser, setState)
  .on(updateUser, (state, payload) => {
    return { ...state, ...payload}
  })

/**
 * Use after failed or success fetching auth from graphql
 * this does not mean if value true user is exist
 */
export const $userLoaded = createStore<boolean>(false).on(setUserLoaded, setState);
