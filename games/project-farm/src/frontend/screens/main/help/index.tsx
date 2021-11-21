import React, { FC, ReactElement } from 'react';

import { ModalLaunch } from '../../../components';

const HelpModal: FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  return (
    <div>
      <h3> Help </h3>
      <p>Goal: Plant seeds and harvest grown crops to feed people</p>
      <p>
        When harvesting a plant, you gain Karma depending on how many people
        that it will feed
      </p>
      <p>You can exchange Karma for more seeds from the Shop.</p>
      <h4>Tools</h4>
      <ul>
        <li>Hoe - Remove weeds and plow dirt. Also removes withered plants</li>
      </ul>
    </div>
  );
};

export const OpenHelp: FC<{
  children: (openModal: () => void) => ReactElement;
}> = ({ children }) => {
  return (
    <ModalLaunch Modal={HelpModal}>
      {(openModal) => children(openModal)}
    </ModalLaunch>
  );
};
