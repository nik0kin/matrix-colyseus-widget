import React, { FC, useState, createContext, useContext } from 'react';

interface RoutingContextType {
  route: 'lobby' | 'play';
  setRoute: (route: 'lobby' | 'play') => void;
}

const RoutingContext = createContext<RoutingContextType>(null as any);

export const RoutingManager: FC = ({ children }) => {
  const [route, setRoute] = useState<'lobby' | 'play'>('lobby');

  return <RoutingContext.Provider value={{
    route,
    setRoute
  }}>{children}</RoutingContext.Provider>
};

export const useRoute = () => {
  return useContext(RoutingContext).route;
};

export const useSetRoute = () => {
  return useContext(RoutingContext).setRoute;
};