import React, { FC, Fragment } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import { FeGameConfig } from 'common';

import './App.css';
import { LobbyManager, RoutingManager, useRoute, useGetJoinedRoom } from './contexts';
import { LobbyScreen } from './screens/lobby';
import { PlayScreen } from './screens/play';

const queryClient = new QueryClient();

const Routes: FC = () => {
  const [route, playGameRoom] = useRoute();
  const getJoinedRoom = useGetJoinedRoom();

  const { isLoading, error, data } = useQuery<{ gamesSupported: FeGameConfig[] }>('repoData', () =>
    fetch('/config/games').then(res => res.json())
  );

  if (isLoading) return <Fragment>Loading...</Fragment>;

  if (error) return <Fragment>An error has occurred: ' {(error as any).message}</Fragment>;

  if (route === 'play') {
    const [gameId, roomId] = playGameRoom!;
    return <PlayScreen room={getJoinedRoom(roomId!)} gameConfig={data!.gamesSupported.find((gameConfig) => {
      return gameConfig.id === gameId;
    })!} />;
  } else {
    return <LobbyScreen gamesConfig={data!.gamesSupported} />;
  }
};

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <RoutingManager>
          <LobbyManager>
            <Routes />
          </LobbyManager>
        </RoutingManager>
      </div>
    </QueryClientProvider>
  );
}

export default App;
