import React, { FC, ReactElement } from 'react';

import { ModalLaunch } from '../../../components';
import { useSendMessage } from '../../../contexts';
import { CHANGE_TOOL_REQUEST } from '../../../../common';

const ToolBoxModal: FC<{ closeModal?: (() => void) }> = ({ closeModal }) => {
  const sendMessage = useSendMessage();

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
        <button onClick={() => changeTool('Potato')}>Potato Seed</button>
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
