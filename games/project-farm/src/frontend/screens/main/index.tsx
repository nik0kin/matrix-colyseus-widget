import React, { FC } from 'react';

import { useServerState } from '../../contexts';

import { Playfield } from './playfield';

// import './style.css';

export const MainScreen: FC = () => {
  const { serverRoomId, sessionId } = useServerState();
  return (
    <div>
      <h3>Farmsprawl</h3>
      <div>
        <Playfield />
      </div>
      <p>RoomId: {serverRoomId}, SessionId: {sessionId}</p>
    </div>
  )
};
