import React, { FC } from 'react';

import './App.css';
// import { ServerManager } from './contexts';
import { LobbyScreen } from './screens/lobby';

const App: FC = () => {
  return (
    <div className="App">
      {/* <ServerManager> */}
      <LobbyScreen />
      {/* </ServerManager> */}
    </div>
  );
}

export default App;
