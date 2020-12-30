import React, { FC, useState, useRef } from 'react';

import { CustomOptions } from 'common';

import { ModalLaunch } from '../../components';
import { useGameConfigs, useLobbyState } from '../../contexts';

interface Props {
  closeModal?: () => void;
}

const CreateGameModal: FC<Props> = ({ closeModal }) => {
  const colyseusGameConfigs = useGameConfigs().filter((gc) => gc.colyseus);
  const { startGame } = useLobbyState();

  const [roomName, setRoomName] = useState('');
  const [gameConfigId, setGameConfig] = useState(colyseusGameConfigs[0].id);
  const gameConfig = colyseusGameConfigs.find((gc) => gc.id === gameConfigId)!;
  const customOptions = useRef<CustomOptions>({});

  const onSubmit = () => {
    startGame(gameConfig.id, { ...customOptions.current, roomName });
    closeModal && closeModal();
  };

  return (
    <div>
      <h1> Create New Multiplayer Game </h1>
      <form>
        <label>
          Room Name:{' '}
          <input type="text" value={roomName} onChange={(v) => setRoomName(v.target.value)} />
        </label>{' '}
        <br />
        <label>
          Game:{' '}
          <select value={gameConfigId} onChange={(v) => setGameConfig(v.target.value)}>
            {colyseusGameConfigs.map((gameConfig) =>
              <option key={gameConfig.id} value={gameConfig.id}>{gameConfig.displayName}</option>
            )}
          </select>
        </label>{' '}
        <br />
        <br />
        {Object.entries(gameConfig?.customOptions || {}).map(([optionName, req]) => (
          <div>
            <label>
              {optionName}:{' '}
              <input type="number" min={req.min} max={req.max} onChange={(v) => {
                customOptions.current[optionName] = Number(v.target.value);
              }} />
            </label>{' '}
            <br />
          </div>
        ))}
        <br />
        <br />
        <button onClick={onSubmit}> Create! </button>
      </form>
    </div>
  );
};

export const OpenCreateGameModal: FC = ({ children }) => {
  return (
    <ModalLaunch Modal={CreateGameModal}>
      {(openModal) => <button onClick={openModal}>{children}</button>}
    </ModalLaunch>
  );
};
