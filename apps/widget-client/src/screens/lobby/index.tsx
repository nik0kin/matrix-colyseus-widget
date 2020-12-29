import React, { FC, useMemo } from 'react';

import { FeGameConfig } from 'common';

import { StartButton } from './start-button';
import { useLobbyState, useGotoPlayGame, useGetJoinedRoom } from '../../contexts';

// import './style.css';

export const LobbyScreen: FC<{ gamesConfig: FeGameConfig[] }> = ({ gamesConfig }) => {
  const { rooms, joinGame } = useLobbyState();
  const getJoinedRoom = useGetJoinedRoom();
  const joinableGames = useMemo(() => {
    return rooms.filter((room) => {
      return room.clients !== room.maxClients && !getJoinedRoom(room.roomId);
    })
  }, [rooms, getJoinedRoom]);
  const activeGames = useMemo(() => {
    // EFF double looping when not needed
    return rooms
      .filter((room) => getJoinedRoom(room.roomId))
      .map((room) => [room, getJoinedRoom(room.roomId)!] as const);
  }, [rooms, getJoinedRoom]);
  const gotoPlayGame = useGotoPlayGame();

  const [singlePlayerGames, multiPlayerGames] = useMemo(() => {
    const singlePlayerGames = gamesConfig.filter((game) => !game.colyseus);
    const multiPlayerGames = gamesConfig.filter((game) => !!game.colyseus);
    return [singlePlayerGames, multiPlayerGames];
  }, [gamesConfig]);

  return (
    <div>
      <h1>Lobby</h1>
      {!!singlePlayerGames.length && <div>
        <h2>SinglePlayer Games</h2>
        <div>
          {singlePlayerGames.map((gameConfig) =>
            <button key={gameConfig.id} onClick={() => gotoPlayGame(gameConfig.id)}>
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
                {room.metadata?.gameId} - Id: {room.roomId} - {room.clients}/{room.maxClients}{' '}
                <button onClick={() => {
                  joinGame(room.roomId);
                }}>join</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Active Games</h3>
          <ul>
            {activeGames.map(([roomAvailable, room]) => (
              <li key={room.id}>
                {roomAvailable.metadata?.gameId} - GameName
                - Id: {room.id} Sess: {room.sessionId}
                - {roomAvailable.clients}/{roomAvailable.maxClients}{' '}
                <button disabled={roomAvailable.clients !== roomAvailable.maxClients} onClick={() =>
                  gotoPlayGame(roomAvailable.metadata!.gameId, room.id)}
                >play</button>
              </li>
            ))}
          </ul>
        </div>
      </div>}
    </div>
  )
};
