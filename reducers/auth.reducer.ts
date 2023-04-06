// mostly use for authentication like register and login, or maybe verify too?

import React, { useReducer } from "react";

interface Action {
  type: string;
  value?: any;
}

const initialState = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  username: ''
}

type AuthState = ReturnType<() => typeof initialState>;

export const authReducer: React.Reducer<AuthState, Action> = (state, action) => {
  const keys = Object.keys(initialState);
  keys.push('reset');

  if (!keys.includes(action.type)) {
    return state;
  }

  if (action.type === 'reset') {
    return initialState;
  }

  return {
    ...state,
    [action.type]: action.value,
  }
}

export function useAuthReducer(): [AuthState, (type: string, value?: any) => void] {
  const [state, reducerDispatch] = useReducer(authReducer, initialState);

  const dispatch = (type: string, value?: any) => reducerDispatch({type, value});

  return [state, dispatch]
}
