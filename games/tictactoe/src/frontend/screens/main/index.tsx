import React, { FC } from 'react';

import { Playfield } from '../../components';
import { useServerState } from '../../contexts';
import { GameStatus } from 'common';

// import './style.css';

export const MainScreen: FC = () => {
  const { serverRoomId, gameStatus } = useServerState();
  return (
    <div>
      <h4>Connected({serverRoomId}) - {getGameStatusString(gameStatus)} </h4>
      <div>
        <Playfield />
      </div>
    </div>
  )
};

function getGameStatusString(gameStatus: GameStatus) {
  return {
    1: 'Waiting for opponent',
    2: 'In Progress',
    3: 'Finished'
  }[gameStatus];
}