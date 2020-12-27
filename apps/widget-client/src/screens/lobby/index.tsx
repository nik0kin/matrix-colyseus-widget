import React, { FC, useMemo } from 'react';

import { StartButton } from './start-button';
import { useLobbyState, useSetPlayGame } from '../../contexts';
import { RoomAvailable } from 'colyseus.js';

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
  const setPlayGame = useSetPlayGame();

  const playGame = (room: RoomAvailable<any>, playGame: string) => {
    setPlayGame(playGame);
  };

  return (
    <div>
      <h1>Lobby</h1>
      {sessionId && <p>SessionId: {sessionId}</p>}
      <div>
        <h2>SinglePlayer Games</h2>
        <div>
          <button onClick={() => playGame(null as any, 'solitaire')}>Play Solitaire</button>
        </div>
      </div>
      <div>
        <div>
          <h2>MultiPlayer Games</h2>
          <div>
            <StartButton />
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
                <button disabled={room.clients !== room.maxClients} onClick={() => playGame(room, 'TicTacToe')}>play</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
};
