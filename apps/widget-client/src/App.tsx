import React, { FC } from 'react';

import './App.css';
import { LobbyManager } from './contexts';
import { LobbyScreen } from './screens/lobby';

const App: FC = () => {
  return (
    <div className="App">
      <LobbyManager>
        <LobbyScreen />
      </LobbyManager>
    </div>
  );
}

export default App;
