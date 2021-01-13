import React, { FC, ReactElement } from 'react';

import { ModalLaunch } from '../../../components';
import { useSendMessage, useServerState } from '../../../contexts';
import { CHANGE_TOOL_REQUEST } from '../../../../common';

const ToolBoxModal: FC<{ closeModal?: (() => void) }> = ({ closeModal }) => {
  const sendMessage = useSendMessage();
  const { gameState } = useServerState();

  const changeTool = (tool: string) => {
    sendMessage(CHANGE_TOOL_REQUEST, {
      tool
    });
    closeModal && closeModal();
  };

  return (
    <div>
      <h3> ToolBox </h3>
      <div>
        <button onClick={() => changeTool('Hoe')}>Hoe</button>
        {gameState && Array.from(gameState.seedInventory.entries()).map(([seedType, amount]) =>
          <button onClick={() => changeTool(seedType)}>{amount} {seedType} Seeds</button>)}
      </div>
    </div>
  )
};

export const OpenToolBox: FC<{ children: (openModal: () => void) => ReactElement }> = ({ children }) => {
  return (
    <ModalLaunch Modal={ToolBoxModal}>
      {(openModal) => children(openModal)}
    </ModalLaunch>
  );
};
