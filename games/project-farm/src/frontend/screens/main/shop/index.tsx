import React, {
  FC,
  ReactElement,
  Fragment,
  useState,
  useCallback,
} from 'react';

import { ModalLaunch } from '../../../components';
import { useSendMessage, useServerState } from '../../../contexts';
import {
  BUY_SEED,
  UNLOCK_SEED,
  BuySeedMessage,
  UnlockSeedMessage,
  getPlantConfigs,
  DEFAULT_HARVEST_LENGTH,
} from '../../../../common';
import './style.css';
import { formatDuration } from '../../../format';

const ShopModal: FC<{ closeModal?: () => void }> = () => {
  const sendMessage = useSendMessage();
  const { gameState } = useServerState();
  const [seedAmounts, setSeedAmounts] = useState<Record<string, number>>(
    () => ({})
  );

  const isSeedUnlocked = useCallback(
    (type: string) => {
      return gameState?.seedsUnlocked.includes(type);
    },
    [gameState?.seedsUnlocked]
  );

  const buySeed = (type: string, amount: number) => {
    const msg: BuySeedMessage = {
      type,
      amount,
    };
    sendMessage(BUY_SEED, msg);
  };

  const unlockSeed = (type: string) => {
    const msg: UnlockSeedMessage = {
      type,
    };
    sendMessage(UNLOCK_SEED, msg);
  };

  return (
    <div className="Shop">
      <h3> Shop - Current Karma: {gameState?.karma} </h3>
      <div className="talking-text-container">
        <div className="portrait type-ShopOwner" />
        <p>
          <strong>Seed Elder</strong>:{' '}
          <em>
            Welcome to the seed vault
            {gameState?.karma === 0 &&
              '. Plant some potatos, people are hungry.'}
          </em>
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
                <div>Grow time: {formatDuration(config.growTime)}</div>
                <div>
                  Harvest time:{' '}
                  {formatDuration(config.harvestTime || DEFAULT_HARVEST_LENGTH)}
                </div>
                <div>Feeds: {config.feeds}</div>
                {config.requirement && (
                  <Fragment>
                    <div
                      style={{
                        textDecoration: isSeedUnlocked(type)
                          ? 'line-through'
                          : '',
                      }}
                    >
                      Requirement: {config.requirement.karma} Karma
                    </div>
                    {!isSeedUnlocked(type) && (
                      <button
                        disabled={
                          (config.requirement.karma || 0) > gameState.karma
                        }
                        onClick={() => unlockSeed(type)}
                      >
                        Unlock
                      </button>
                    )}
                  </Fragment>
                )}
                {(!config.requirement || isSeedUnlocked(type)) && (
                  <Fragment>
                    <div>
                      Amount:{' '}
                      <input
                        type="number"
                        value={seedAmounts[type] || 0}
                        min={0}
                        onChange={(v) => {
                          setSeedAmounts({
                            ...seedAmounts,
                            [type]: Number(v.target.value),
                          });
                        }}
                      />
                    </div>
                    <button
                      disabled={!seedAmounts[type]}
                      onClick={() => buySeed(type, seedAmounts[type])}
                    >
                      Buy
                    </button>
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
