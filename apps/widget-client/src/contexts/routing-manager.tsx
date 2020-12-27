import React, { FC, useState, createContext, useContext, useCallback } from 'react';

interface RoutingContextType {
  route: 'lobby' | 'play';
  playGame: string | null;
  setRoute: (route: 'lobby' | 'play') => void;
  setPlayGame: (playGame: string) => void;
}

const RoutingContext = createContext<RoutingContextType>(null as any);

export const RoutingManager: FC = ({ children }) => {
  const [route, setRoute] = useState<'lobby' | 'play'>('lobby');
  const [playGame, _setPlayGame] = useState<string | null>(null);

  const setPlayGame = useCallback((playGame: string) => {
    setRoute('play');
    _setPlayGame(playGame);
  }, []);

  return <RoutingContext.Provider value={{
    route,
    playGame,
    setRoute,
    setPlayGame
  }}>{children}</RoutingContext.Provider>
};

export const useRoute = () => {
  return [useContext(RoutingContext).route, useContext(RoutingContext).playGame];
};

export const useSetRoute = () => {
  return useContext(RoutingContext).setRoute;
};

export const useSetPlayGame = () => {
  return useContext(RoutingContext).setPlayGame;
};
