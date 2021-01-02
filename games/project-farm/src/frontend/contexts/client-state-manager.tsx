import React, { FC, useState, createContext, useContext } from 'react';

import { Coord } from 'utils';

interface ClientManagerType {
  selectedPlot: Coord | null;

  setSelectedPlot: (coord: Coord) => void;
}

const ClientContext = createContext<ClientManagerType>(null as any);

export const ClientManager: FC = ({ children }) => {
  const [selectedPlot, setSelectedPlot] = useState<Coord | null>(null);

  return <ClientContext.Provider value={{
    selectedPlot, setSelectedPlot
  }}>{children}</ClientContext.Provider>
};

export const useClientState = () => {
  return useContext(ClientContext);
};
