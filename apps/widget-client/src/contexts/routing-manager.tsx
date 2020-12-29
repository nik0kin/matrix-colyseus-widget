import React, { FC, useState, createContext, useContext, useCallback } from 'react';

interface RoutingContextType {
  route: 'lobby' | 'play';
  playRoomGame: [string, string | null] | null; // TODO rename?
  setRoute: (route: 'lobby' | 'play') => void;
  gotoPlayGame: (gameId: string, roomId?: string) => void;
}

const RoutingContext = createContext<RoutingContextType>(null as any);

export const RoutingManager: FC = ({ children }) => {
  const [route, setRoute] = useState<'lobby' | 'play'>('lobby');
  const [playRoomGame, _setPlayRoomGame] = useState<[string, string | null] | null>(null);

  const gotoPlayGame = useCallback((gameId: string, roomId?: string) => {
    setRoute('play');
    _setPlayRoomGame([gameId, roomId || null]);
  }, []);

  return <RoutingContext.Provider value={{
    route,
    playRoomGame,
    setRoute,
    gotoPlayGame
  }}>{children}</RoutingContext.Provider>
};

export const useRoute = () => {
  return [useContext(RoutingContext).route, useContext(RoutingContext).playRoomGame] as const;
};

export const useSetRoute = () => {
  return useContext(RoutingContext).setRoute;
};

export const useGotoPlayGame = () => {
  return useContext(RoutingContext).gotoPlayGame;
};
