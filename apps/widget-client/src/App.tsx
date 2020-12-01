import React, { FC } from 'react';

import './App.css';
import { LobbyManager, RoutingManager, useRoute } from './contexts';
import { LobbyScreen } from './screens/lobby';
import { PlayScreen } from './screens/play';

const Routes: FC = () => {
  const route = useRoute();

  if (route === 'play') {
    return <PlayScreen />;
  } else {
    return <LobbyScreen />;
  }
};

const App: FC = () => {
  return (
    <div className="App">
      <RoutingManager>
        <LobbyManager>
          <Routes />
        </LobbyManager>
      </RoutingManager>
    </div>
  );
}

export default App;
