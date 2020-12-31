import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { loadMuleState } from './actions';
import App from './App';
import { generalReducer } from './reducers/index';
import { StoreState, GameState } from './types/index';

import './index.css';

export function bootstrapFrontend(): void {

  // const sagaMiddleware: SagaMiddleware<{}> = createSagaMiddleware();

  // Setup Redux Store (w/ initial state)
  const store = createStore<StoreState>(
    generalReducer,
    {
      ui: {
        selectedCoord: undefined
      },
      isGameStateLoaded: false,
      isSubmitting: false,
      gameState: {} as GameState,
      pendingTurn: {
        actions: [],
      },
    },
  );

  // Setup React w/ Redux Store
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

  // Load Game State from Mule backend
  store.dispatch(loadMuleState());
}
