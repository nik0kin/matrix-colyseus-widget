import React, { FC } from 'react';
import { formatNumber } from 'utils';

import { getPlantFromPlot } from '../../../common';
import { useServerState, useClientState } from '../../contexts';

import { Playfield } from './playfield';
import { OpenToolBox } from './tool-box';

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
  const plant = plot && getPlantFromPlot(plot);
  return (
    <div className="Info">
      <div className="section">
        People Fed: 0, Karma: 0
      </div>
      <div className="section">
        {selectedPlot && plot && <div>
          {selectedPlot.x},{selectedPlot.y} {plot.dirt}<br />
          {plant && <span>
            {plant.type} {plant.stage} {formatNumber(msToMinutes(plant.timeLeft))} minutes left
          </span>}
        </div>}
      </div>
    </div>
  );
};

const ToolButton: FC = () => {
  const { gameState } = useServerState();
  return (
    <OpenToolBox>
      {(openModal) => <div className="ToolButton" onClick={openModal}>{gameState?.characters[0].tool}</div>}
    </OpenToolBox>
  );
};

const ShopButton: FC = () => {
  return <div className="ShopButton">Shop</div>;
};

function msToMinutes(ms: number) {
  const minutes = ms / 1000 / 60;
  return minutes;
}
