import { StoreState } from '../types';

export function clickSubmitReducer(state: StoreState): StoreState {
  return {
    ...state,
    isSubmitting: true,
  };
}
