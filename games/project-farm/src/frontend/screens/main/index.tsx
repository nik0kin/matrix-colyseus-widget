import React, { FC } from 'react';
import { formatNumber } from 'utils';

import { getPlantFromPlot } from '../../../common';
import { useServerState, useClientState } from '../../contexts';
import { formatDuration } from '../../format';

import { OpenHelp } from './help';
import { Playfield } from './playfield';
import { OpenShop } from './shop';
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
      <p>
        RoomId: {serverRoomId}, SessionId: {sessionId}
      </p>
    </div>
  );
};

const Info: FC = () => {
  const { gameState } = useServerState();
  const { selectedPlot } = useClientState();
  const plot =
    selectedPlot &&
    gameState?.map.find(
      (p) => selectedPlot.x === p.coord.x && selectedPlot.y === p.coord.y
    );
  const plant = plot && getPlantFromPlot(plot);
  return (
    <div className="Info">
      <div className="section">
        People Fed: {formatNumber(gameState?.peopleFed || 0)} Karma:{' '}
        {formatNumber(gameState?.karma || 0)} <HelpButton />
      </div>
      <div className="section">
        {selectedPlot && plot && (
          <div>
            {selectedPlot.x},{selectedPlot.y} {plot.dirt}
            <br />
            {plant && (
              <span>
                {plant.type} {plant.stage} {formatDuration(plant.timeLeft)} left
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ToolButton: FC = () => {
  const { gameState } = useServerState();
  return (
    <OpenToolBox>
      {(openModal) => (
        <div className="ToolButton" onClick={openModal}>
          {gameState?.characters[0].tool}
        </div>
      )}
    </OpenToolBox>
  );
};

const ShopButton: FC = () => {
  return (
    <OpenShop>
      {(openModal) => (
        <div className="ShopButton" onClick={openModal}>
          Shop
        </div>
      )}
    </OpenShop>
  );
};

const HelpButton: FC = () => {
  return (
    <OpenHelp>
      {(openModal) => (
        <button className="HelpButton" onClick={openModal}>
          <small>Help</small>
        </button>
      )}
    </OpenHelp>
  );
};
