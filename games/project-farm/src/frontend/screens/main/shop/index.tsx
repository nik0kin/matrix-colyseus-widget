import React, { FC, ReactElement, Fragment } from 'react';

import { ModalLaunch } from '../../../components';
import { useSendMessage, useServerState } from '../../../contexts';
import { getPlantConfigs } from '../../../../common';
import './style.css';
import { toMinutesSeconds } from '../../../format';

const ShopModal: FC<{ closeModal?: () => void }> = () => {
  const sendMessage = useSendMessage();
  const { gameState } = useServerState();

  // const buySeed = (tool: string) => {
  //   sendMessage(CHANGE_TOOL_REQUEST, {
  //     tool,
  //   });
  // };

  return (
    <div className="Shop">
      <h3> Shop - Current Karma: {gameState?.karma} </h3>
      <div className="talking-text-container">
        <div className="portrait type-ShopOwner" />
        <p>
          <strong>Seed Elder</strong>: Welcome to the seed vault
        </p>
      </div>
      <div>
        {gameState &&
          Object.entries(getPlantConfigs())
            .filter(([, config]) => config.cost > 0)
            .map(([type, config]) => (
              <div>
                <h4>{type}</h4>
                <div>Cost: {config.cost}</div>
                <div>Grow time: {toMinutesSeconds(config.growTime)}</div>
                <div>Feeds: {config.feeds}</div>
                {config.requirement && (
                  <Fragment>
                    <div>Requirement: {config.requirement.karma} Karma</div>
                    <button>Unlock</button>
                  </Fragment>
                )}
                {!config.requirement && (
                  <Fragment>
                    <div>
                      Amount: <input type="number" />
                    </div>
                    <button>Buy</button>
                  </Fragment>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export const OpenShop: FC<{
  children: (openModal: () => void) => ReactElement;
}> = ({ children }) => {
  return (
    <ModalLaunch Modal={ShopModal}>
      {(openModal) => children(openModal)}
    </ModalLaunch>
  );
};
