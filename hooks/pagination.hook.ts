import { paginationInitialState, paginationReducer } from '@/reducers/pagination.reducer';
import React, { useReducer } from 'react';

// do not use this for now
export const usePagination = () => {
  const [state, dispatch ] = useReducer(paginationReducer, paginationInitialState)

  const setPagination = React.useCallback((data: any) => {
    dispatch({type: 'set', value: data})
  }, [])

  return {
    pagination: state,
    setPagination,
  }
}