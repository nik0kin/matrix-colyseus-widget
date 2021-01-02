import React, { FC } from 'react';

import { useServerState, useClientState } from '../../contexts';

import { Playfield } from './playfield';

import './style.css';

export const MainScreen: FC = () => {
  const { serverRoomId, sessionId } = useServerState();
  return (
    <div>
      <div>
        <Info />
        <Playfield />
        <ToolButton />
        <ShopButton />
      </div>
      <p>RoomId: {serverRoomId}, SessionId: {sessionId}</p>
    </div>
  )
};

const Info: FC = () => {
  const { gameState } = useServerState();
  const { selectedPlot } = useClientState();
  const plot = selectedPlot && gameState?.map.find((p) => selectedPlot.x === p.coord.x && selectedPlot.y === p.coord.y);
  return (
    <div className="Info">
      {selectedPlot && plot && <div>
        {selectedPlot.x},{selectedPlot.y} {plot.dirt}
      </div>}
    </div>
  );
};

const ToolButton: FC = () => {
  const { gameState } = useServerState();
  return <div className="ToolButton">{gameState?.characters[0].tool}</div>;
};

const ShopButton: FC = () => {
  return <div className="ShopButton">Shop</div>;
};
