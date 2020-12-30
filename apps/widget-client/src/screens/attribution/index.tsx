import React, { FC } from 'react';

import { ModalLaunch } from '../../components';
import { useGameConfigs } from '../../contexts';

interface Props {
  closeModal?: () => void;
}

const AttributionModal: FC<Props> = () => {
  const gamesWithAttributions = useGameConfigs().filter((gc) => gc.attribution);

  return (
    <div>
      <h1> Licenses </h1>
      {gamesWithAttributions.map((gameConfig) => (
        <div key={gameConfig.id} style={{ marginBottom: '4px' }}>
          {gameConfig.displayName} - {gameConfig.attribution!.license} - {gameConfig.attribution!.author} - <a href={gameConfig.attribution?.source} target="_blank" rel="noreferrer">source</a>
        </div>
      ))}
    </div>
  );
};

export const OpenAttributionModal: FC = ({ children }) => {
  return (
    <ModalLaunch Modal={AttributionModal}>
      {(openModal) => <button onClick={openModal}>{children}</button>}
    </ModalLaunch>
  );
};
