import React, { FC } from 'react';

import { useServerState } from '../../contexts';

import { Playfield } from './playfield';

// import './style.css';

export const MainScreen: FC = () => {
  const { serverRoomId, sessionId } = useServerState();
  return (
    <div>
      <h2>Farmsprawl</h2>
      <div>
        <Playfield />
      </div>
      <p>RoomId: {serverRoomId}</p>
      <p>SessionId: {sessionId}</p>
    </div>
  )
};
