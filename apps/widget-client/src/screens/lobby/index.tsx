import { RoomAvailable } from 'colyseus.js';
import React, { FC, useMemo } from 'react';

import { FeGameConfig } from 'common';

import { StartButton } from './start-button';
import { useLobbyState, useSetPlayGame } from '../../contexts';

// import './style.css';

export const LobbyScreen: FC<{ gamesConfig: FeGameConfig[] }> = ({ gamesConfig }) => {
  const { sessionId, rooms, joinGame } = useLobbyState();
  const joinableGames = useMemo(() => {
    return rooms.filter((room) => {
      return !room.metadata?.players.includes(sessionId) && room.clients !== room.maxClients;
    });
  }, [rooms, sessionId]);
  const activeGames = useMemo(() => {
    return rooms.filter((room) => {
      return room.metadata?.players.includes(sessionId);
    });
  }, [rooms, sessionId]);
  const setPlayGame = useSetPlayGame();

  const playGame = (room: RoomAvailable<any>, playGame: string) => {
    setPlayGame(playGame);
  };

  const [singlePlayerGames, multiPlayerGames] = useMemo(() => {
    const singlePlayerGames = gamesConfig.filter((game) => !game.colyseus);
    const multiPlayerGames = gamesConfig.filter((game) => !!game.colyseus);
    return [singlePlayerGames, multiPlayerGames];
  }, [gamesConfig]);

  return (
    <div>
      <h1>Lobby</h1>
      {sessionId && <p>SessionId: {sessionId}</p>}
      {!!singlePlayerGames.length && <div>
        <h2>SinglePlayer Games</h2>
        <div>
          {singlePlayerGames.map((gameConfig) =>
            <button key={gameConfig.id} onClick={() => playGame(null as any, gameConfig.id)}>
              Play {gameConfig.displayName}
            </button>
          )}
        </div>
      </div>}
      {!!multiPlayerGames.length && <div>
        <div>
          <h2>MultiPlayer Games</h2>
          <div>
            {multiPlayerGames.map((gameConfig) => <StartButton key={gameConfig.id} gameConfig={gameConfig} />)}
          </div>
          <h3>Joinable Games</h3>
          <ul>
            {joinableGames.map((room) => (
              <li key={room.roomId}>
                {room.roomId} - {room.metadata?.game} - {room.clients}/{room.maxClients} <button onClick={() => {
                  joinGame(room.roomId);
                }}>join</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Active Games</h3>
          <ul>
            {activeGames.map((room) => (
              <li key={room.roomId}>
                {room.roomId} - {room.metadata?.game} - {room.clients}/{room.maxClients}
                <button disabled={room.clients !== room.maxClients} onClick={() => playGame(room, room.metadata!.game)}>play</button>
              </li>
            ))}
          </ul>
        </div>
      </div>}
    </div>
  )
};
