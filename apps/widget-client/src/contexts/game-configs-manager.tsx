import React, { FC, Fragment, useContext } from 'react';
import { useQuery } from 'react-query';

import { FeGameConfig } from 'common';
import { createContext } from 'react';

interface GameConfigsType {
  gameConfigs: FeGameConfig[];
}

const GameConfigsContext = createContext<GameConfigsType>(null as any);

export const GameConfigsManager: FC = ({ children }) => {
  const { isLoading, error, data } = useQuery<{ gamesSupported: FeGameConfig[] }>('repoData', () =>
    fetch('/config/games').then(res => res.json())
  );

  if (isLoading) return <Fragment>Loading...</Fragment>;

  if (error) return <Fragment>An error has occurred: ' {(error as any).message}</Fragment>;

  return <GameConfigsContext.Provider value={{ gameConfigs: data!.gamesSupported }}>{children}</GameConfigsContext.Provider>;
}

export const useGameConfigs = () => useContext(GameConfigsContext).gameConfigs;

export const useGetGameConfig = () => {
  const { gameConfigs } = useContext(GameConfigsContext);
  return (gameId: string) => {
    return gameConfigs.find((g) => gameId === g.id);
  };
};
