import React, { FC, useMemo, Fragment } from 'react';

import { StartButton } from './start-button';
import { useLobbyState } from '../../contexts';

// import './style.css';

export const LobbyScreen: FC = () => {
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

  return (
    <div>
      <h1>Lobby {sessionId && <Fragment>- {sessionId}</Fragment>}</h1>
      <div>
        <StartButton />
      </div>
      <div>
        <h2>Joinable Games</h2>
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
        <h2>Active Games</h2>
        <ul>
          {activeGames.map((room) => (
            <li key={room.roomId}>
              {room.roomId} - {room.metadata?.game} - {room.clients}/{room.maxClients} <button disabled={room.clients !== room.maxClients}>play</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
};
