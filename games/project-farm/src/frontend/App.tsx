import React, { FC } from 'react';

import './App.css';
import { ClientManager, ServerManager } from './contexts';
import { MainScreen } from './screens/main';

const App: FC = () => {
  return (
    <div className="App">
      <ServerManager>
        <ClientManager>
          <MainScreen />
        </ClientManager>
      </ServerManager>
    </div>
  );
}

export default App;
