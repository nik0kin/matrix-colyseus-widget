import React, { FC } from 'react';

import { FeGameConfig } from 'common';

import { useSetRoute } from '../../contexts';

import './style.css';

export const PlayScreen: FC<{ gameConfig: FeGameConfig }> = ({ gameConfig }) => {
  const setRoute = useSetRoute();

  return (
    <div className="PlayScreen">
      <nav>
        <button onClick={() => setRoute('lobby')}>Back</button>
      </nav>
      <iframe title="Game" src={gameConfig.frontend}></iframe>
    </div>
  )
};
