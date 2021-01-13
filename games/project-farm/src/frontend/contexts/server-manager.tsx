import * as Colyseus from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';

import { GameState } from '../../common';

// eslint-disable-next-line no-restricted-globals
const client = new Colyseus.Client(`${location.protocol.includes('https') ? 'wss' : 'ws'}://${location.hostname}:2567`);

const setReconnectData = (room: Colyseus.Room) => {
  sessionStorage.setItem('lastRoomId', room.id);
  sessionStorage.setItem('lastSessionId', room.sessionId);
};

const getRoom = async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const lastRoomId = urlParams.get('r') || sessionStorage.getItem('lastRoomId');
  const lastSessionId = urlParams.get('s') || sessionStorage.getItem('lastSessionId');

  // Attempt reconnect
  if (lastRoomId && lastSessionId) {
    try {
      const room = await client.reconnect<GameState>(lastRoomId, lastSessionId);
      setReconnectData(room);
      return room;
    } catch (e) {
      // ignore
    }
  }

  const room = await client.joinOrCreate<GameState>('project-farm'); // matches id in mcw.config.js TODO pass in via env var?
  setReconnectData(room);
  return room;
};

const initConnection = async (
  onGameStateUpdate: (gameState: GameState) => void,
) => {
  try {
    const room = await getRoom();

    room.onStateChange.once((state) => {
      console.log("this is the first room state!", state);
      onGameStateUpdate(state);
    });

    room.onStateChange((state) => {
      console.log("the room state has been updated:", state);
      onGameStateUpdate(state);
    });

    return [
      room.id,
      room.sessionId,
      (type: string | number, payload?: any) => {
        console.log(type, payload);
        room.send(type, payload);
      },
    ] as const;
  } catch (e) {
    console.log('Could not join!');
    console.error(e);
    return Promise.reject('Fack');
  }
}

interface ServerManagerType {
  serverRoomId: string;
  sessionId: string;
  gameState: Pick<GameState, 'map' | 'characters' | 'seedInventory' | 'customOptions'> | null;

  sendMessage: (type: string | number, payload?: any) => void;
}

const ServerContext = createContext<ServerManagerType>(null as any);

export const ServerManager: FC = ({ children }) => {
  const [gameState, setGameState] = useState<Pick<GameState, 'map' | 'characters' | 'seedInventory' | 'customOptions'> | null>(null);
  const [serverRoomId, setServerRoomId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [sendMessage, setSendMessage] = useState<(type: string | number, payload?: any) => void>(() => () => null);

  const onGameStatusUpdate = useCallback((gameState: GameState) => {
    // cheap (code), but costly (rendering everything) way to redraw the playfield
    setGameState({ ...gameState })
  }, []);

  useEffect(() => {
    initConnection(onGameStatusUpdate)
      .then(([roomId, sessionId, sendMessage]) => {
        setIsConnected(true);
        setServerRoomId(roomId);
        setSessionId(sessionId);
        setSendMessage(() => sendMessage);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isConnected) return null;

  return <ServerContext.Provider value={{
    serverRoomId, sessionId, gameState,
    sendMessage
  }}>{children}</ServerContext.Provider>
};

export const useServerState = () => {
  const { sendMessage, ...state } = useContext(ServerContext)
  return state;
};
export const useSendMessage = () => useContext(ServerContext).sendMessage;
