import React, { FC } from 'react';

import { areCoordsEqual } from 'utils';

import { Plot } from './plot';

import './style.css';
import { useServerState, useClientState } from '../../../contexts';

export const Playfield: FC = () => {
  const { gameState } = useServerState();
  const { selectedPlot } = useClientState();
  const characterActions = gameState?.characters[0].actionQueue || [];

  if (!gameState) {
    return <div />;
  }

  return (
    <div className="Playfield">
      <div className="container">
        <div className="inner">
          {gameState.map.map((p, i) => {
            return <Plot key={i} plot={p}
              selectedForAction={!!characterActions.find((ca) => ca.type !== 'Move' && areCoordsEqual(ca.coord, p.coord))}
              selected={!!selectedPlot && areCoordsEqual(selectedPlot, p.coord)}
            />
          })}
          {gameState.characters.map((c, i) => <div key={i} className="Character" style={{
            left: `calc(7vh * ${c.coord.x})`,
            top: `calc(7vh * ${c.coord.y})`
          }} />)}
        </div>
      </div>
    </div>
  );
};
