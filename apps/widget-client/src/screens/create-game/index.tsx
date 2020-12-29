import React, { FC } from 'react';
import { ModalLaunch } from '../../components';

interface Props {
  closeModal?: () => void;
}

const CreateGameModal: FC<Props> = () => {
  return (
    <div>
      <h1> Create New Multiplayer Game </h1>
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
