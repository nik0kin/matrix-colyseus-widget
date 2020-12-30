import React, { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query'

import './App.css';
import { LobbyManager, RoutingManager, useRoute, useGetJoinedRoom, GameConfigsManager } from './contexts';
import { LobbyScreen } from './screens/lobby';
import { PlayScreen } from './screens/play';

const queryClient = new QueryClient();

const Routes: FC = () => {
  const [route, playGameRoom] = useRoute();
  const getJoinedRoom = useGetJoinedRoom();

  if (route === 'play') {
    const [gameId, roomId] = playGameRoom!;
    return <PlayScreen gameId={gameId} room={getJoinedRoom(roomId!)} />;
  } else {
    return <LobbyScreen />;
  }
};

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GameConfigsManager>
        <div className="App">
          <RoutingManager>
            <LobbyManager>
              <Routes />
            </LobbyManager>
          </RoutingManager>
        </div>
      </GameConfigsManager>
    </QueryClientProvider>
  );
}

export default App;
