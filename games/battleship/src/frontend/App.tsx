import * as React from 'react';

import './App.css';
import LoadScreen from './containers/LoadScreen';
import { ServerManager } from './gamestate/colyseus';

function App() {
  return (
    <div>
      <ServerManager>
        <LoadScreen />
      </ServerManager>
    </div>
  );
}

export default App;
