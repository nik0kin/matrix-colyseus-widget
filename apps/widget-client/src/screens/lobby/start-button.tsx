import React, { FC } from 'react';
import { FeGameConfig } from 'common';
import { useLobbyState } from '../../contexts';

export const StartButton: FC<{ gameConfig: FeGameConfig }> = ({ gameConfig }) => {
  const { startGame } = useLobbyState();
  return <button onClick={() => startGame(gameConfig.id)}>Start new {gameConfig.displayName} game</button>;
};
