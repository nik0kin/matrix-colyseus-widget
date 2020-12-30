import React, { FC, useMemo, Fragment } from 'react';

import { GameStatus } from 'common';

import { StartButton } from './start-button';
import { GameCard } from '../../components';
import { useLobbyState, useGotoPlayGame, useGetJoinedRoom, useGameConfigs } from '../../contexts';
import { OpenAttributionModal } from '../attribution';
import { OpenCreateGameModal } from '../create-game';

// import './style.css';

export const LobbyScreen: FC = () => {
  const { rooms, joinGame } = useLobbyState();
  const getJoinedRoom = useGetJoinedRoom();
  const gameConfigs = useGameConfigs();

  const joinableGames = useMemo(() => {
    return rooms.filter((room) => {
      return room.clients !== room.maxClients && !getJoinedRoom(room.roomId);
    })
  }, [rooms, getJoinedRoom]);
  const activeGames = useMemo(() => {
    // EFF double looping when not needed
    return rooms
      .filter((room) => {
        const jr = getJoinedRoom(room.roomId);
        return jr && room.metadata?.gameStatus !== GameStatus.Finished
      })
      .map((room) => [room, getJoinedRoom(room.roomId)!] as const);
  }, [rooms, getJoinedRoom]);
  const finishedGames = useMemo(() => {
    // EFF double looping when not needed
    return rooms
      .filter((room) => {
        const jr = getJoinedRoom(room.roomId);
        return jr && room.metadata?.gameStatus === GameStatus.Finished
      })
      .map((room) => [room, getJoinedRoom(room.roomId)!] as const);
  }, [rooms, getJoinedRoom]);
  const gotoPlayGame = useGotoPlayGame();

  const [singlePlayerGames, multiPlayerGames] = useMemo(() => {
    const singlePlayerGames = gameConfigs.filter((game) => !game.colyseus);
    const multiPlayerGames = gameConfigs.filter((game) => !!game.colyseus);
    return [singlePlayerGames, multiPlayerGames];
  }, [gameConfigs]);

  return (
    <div>
      <h1>Lobby</h1>
      {!!singlePlayerGames.length && <div>
        <h2>SinglePlayer Games</h2>
        <div>
          {singlePlayerGames.map((gameConfig) =>
            <Fragment key={gameConfig.id}>
              <button onClick={() => gotoPlayGame(gameConfig.id)}>
                Play {gameConfig.displayName}
              </button>
              {' '}
            </Fragment>
          )}
        </div>
      </div>}
      {!!multiPlayerGames.length && <div>
        <div>
          <h2>MultiPlayer Games</h2>
          <div>
            {multiPlayerGames
              .filter((gameConfig) => gameConfig.quickOptions)
              .map((gameConfig) => <StartButton key={gameConfig.id} gameConfig={gameConfig} />)}
            {' '}
            <OpenCreateGameModal>Create Custom Game</OpenCreateGameModal>
          </div>
          <h3>Joinable Games</h3>
          {joinableGames.map((room) => (
            <GameCard key={room.roomId} roomAvailable={room}>
              <button onClick={() => {
                joinGame(room.roomId);
              }}>join</button>
            </GameCard>
          ))}
        </div>
        <div>
          <h3>Active Games</h3>
          {activeGames.map(([roomAvailable, room]) => (
            <GameCard key={room.id} roomAvailable={roomAvailable} room={room}>
              <button disabled={roomAvailable.clients !== roomAvailable.maxClients} onClick={() =>
                gotoPlayGame(roomAvailable.metadata!.gameId, room.id)}
              >play</button>
            </GameCard>
          ))}
        </div>
        <div>
          <h3>Completed Games</h3>
          {finishedGames.map(([roomAvailable, room]) => (
            <GameCard key={room.id} roomAvailable={roomAvailable} room={room}>
              <button disabled={roomAvailable.clients !== roomAvailable.maxClients} onClick={() =>
                gotoPlayGame(roomAvailable.metadata!.gameId, room.id)}
              >view</button>
            </GameCard>
          ))}
        </div>
      </div>}
      <div style={{ marginTop: '40px' }}>
        <OpenAttributionModal>Licenses</OpenAttributionModal>
      </div>
    </div>
  )
};
