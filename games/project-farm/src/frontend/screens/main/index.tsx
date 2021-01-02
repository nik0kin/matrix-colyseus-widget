import React, { FC } from 'react';

import { useServerState } from '../../contexts';

import { Playfield } from './playfield';

import './style.css';

export const MainScreen: FC = () => {
  const { serverRoomId, sessionId } = useServerState();
  return (
    <div>
      <h3>Farmsprawl</h3>
      <div>
        <Playfield />
        <ToolButton />
        <ShopButton />
      </div>
      <p>RoomId: {serverRoomId}, SessionId: {sessionId}</p>
    </div>
  )
};

const ToolButton: FC = () => {
  const { gameState } = useServerState();
  return <div className="ToolButton">{gameState?.characters[0].tool}</div>;
};

const ShopButton: FC = () => {
  return <div className="ShopButton">Shop</div>;
};
