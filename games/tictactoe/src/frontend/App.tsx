import React, { FC } from 'react';

import './App.css';
import { ServerManager } from './contexts';
import { MainScreen } from './screens/main';

const App: FC = () => {
  return (
    <div className="App">
      <ServerManager>
        <MainScreen />
      </ServerManager>
    </div>
  );
}

export default App;
