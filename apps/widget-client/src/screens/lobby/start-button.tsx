import React, { FC } from 'react';
import { useLobbyState } from '../../contexts';

export const StartButton: FC = () => {
  const { startGame } = useLobbyState();
  return <button onClick={startGame}>Start new TicTacToe game</button>;
};
