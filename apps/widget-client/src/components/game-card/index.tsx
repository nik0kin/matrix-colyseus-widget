import { RoomAvailable } from 'colyseus.js';
import React, { FC, useState } from 'react';

import { RoomMetadata, GameStatus } from 'common';

import { useGetGameConfig } from '../../contexts';
import './style.css';

interface Props {
  roomAvailable: RoomAvailable<RoomMetadata>;
  room?: { id: string; sessionId: string; };
}

export const GameCard: FC<Props> = ({ children, roomAvailable, room }) => {
  const [collapsed, setCollapsed] = useState(true);
  const getGameConfig = useGetGameConfig();

  // const roomAvailable2 = {
  //   roomId: 'xx3xx',
  //   metadata: {
  //     gameId: 'connectx',
  //     name: 'RoomName',
  //     players: [
  //       { id: 'xy', name: 'Nikki' }
  //     ],
  //     customOptions: {
  //       width: 7,
  //       height: 6,
  //       connectLength: 4
  //     }
  //   },
  //   clients: 1,
  //   maxClients: 2,
  // };

  return (
    <div className="GamePanel">
      <div className="firstRow">
        {roomAvailable.metadata && getGameStatusString(roomAvailable.metadata?.gameStatus)}{' '}
        {roomAvailable.metadata?.name && <strong> - {roomAvailable.metadata.name}</strong>}{' '}
        - {roomAvailable.clients}/{roomAvailable.maxClients}{' '}
        <span style={{ flexGrow: 2 }}> - {roomAvailable.metadata?.gameId && getGameConfig(roomAvailable.metadata!.gameId)?.displayName}</span>{' '}
        {children}
      </div>
      <button onClick={() => setCollapsed(!collapsed)}>{collapsed ? '^' : 'V'}</button>{' '}
      <small>Id: {roomAvailable.roomId} {room && <span>Sess: {room.sessionId}</span>}</small>
      {!collapsed && roomAvailable.metadata && <div>
        <div style={{ marginTop: '6px', marginBottom: '6px' }}>
          Players: {roomAvailable.metadata.players.map((p) => p.name).join(', ')}
        </div>
        <div>
          Options: {JSON.stringify(roomAvailable.metadata.customOptions)}
        </div>
      </div>}
    </div>
  )
};

function getGameStatusString(gameStatus: GameStatus) {
  return {
    1: 'Open',
    2: 'In Progress',
    3: 'Finished'
  }[gameStatus];
}
