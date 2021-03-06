import React, { FC, Fragment } from 'react';

import { Playfield } from '../../components';
import { useServerState } from '../../contexts';
import { GameStatus } from 'common';

// import './style.css';

export const MainScreen: FC = () => {
  const { serverRoomId, sessionId, gameStatus, isPlayerX, isPlayersTurn, winner } = useServerState();
  return (
    <div>
      <h2>{getGameStatusString(gameStatus)} </h2>
      <div>
        <Playfield />
      </div>
      {gameStatus !== GameStatus.PreGame && <Fragment>
        {!winner && <h3>
          {isPlayersTurn ? 'Your Turn' : 'Opponent\'s Turn'}
        </h3>}
        <h3>
          You are <strong>{isPlayerX ? 'X' : 'O'}</strong>
        </h3>
        {winner && <h3>
          {(winner === 'X' && isPlayerX) || (winner === 'O' && !isPlayerX) ? 'You Won' : 'You Lost'}
        </h3>}
      </Fragment>}
      <p>RoomId: {serverRoomId}</p>
      <p>SessionId: {sessionId}</p>
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