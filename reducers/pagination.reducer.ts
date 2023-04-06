import React from "react";

export const paginationInitialState = {
  count: 0,
  currentPage: 1,
  lastPage: 0,
  perPage: 20,
  hasMorePages: false,
  total: 0,
}

export type PaginationState = ReturnType<() => typeof paginationInitialState>;

export interface PaginationAction {
  type: 'set' | 'change';
  value?: Partial<PaginationState>;
}

export const paginationReducer: React.Reducer<PaginationState, PaginationAction> = (state, action) => {
  if (action.type == 'change') {
    return {
      ...state,
      currentPage: action.value?.currentPage || 1
    }
  }

  if (action.type === 'set') {
    return {
      ...state,
      ...action.value,
    }
  }

  return state;
}