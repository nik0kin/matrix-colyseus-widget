import * as Colyseus from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';
import { GameState, GameStatus } from 'common';

var client = new Colyseus.Client('ws://localhost:2567');

const setReconnectData = (room: Colyseus.Room) => {
  sessionStorage.setItem('lastRoomId', room.id);
  sessionStorage.setItem('lastSessionId', room.sessionId);
};

const getRoom = async () => {
  const lastRoomId = sessionStorage.getItem('lastRoomId');
  const lastSessionId = sessionStorage.getItem('lastSessionId');

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

  const room = await client.joinOrCreate<GameState>('TicTacToe', { name: 'Nikki' });
  setReconnectData(room);
  return room;
};

const initConnection = async (
  onGameStatusUpdate: (gameStatus: GameStatus) => void
) => {
  try {
    const room = await getRoom();

    room.onMessage('game-start', () => {
      onGameStatusUpdate(GameStatus.InProgress);
    });

    room.onStateChange.once((state) => {
      console.log("this is the first room state!", state);
      onGameStatusUpdate(state.status);
    });

    room.onStateChange((state) => {
      console.log("the room state has been updated:", state);
    });

    room.state.players.onAdd = (player, key) => {
      console.log(player, "has been added at", key);
      // onPlayerConnect(key);
    };

    room.state.players.onRemove = (player, key) => {
      console.log(player, "has been removed at", key);
      // onPlayerDisconnect(key);
    };

    return [
      room.id,
      (type: string | number, payload?: any) => room.send(type, payload),
    ] as const;
  } catch (e) {
    console.log('Could not join!');
    console.error(e);
    return Promise.reject('Fack');
  }
}

interface ServerManagerType {
  serverRoomId: string;
  gameStatus: GameStatus;

  sendMessage: (type: string | number, payload?: any) => void;
}

const ServerContext = createContext<ServerManagerType>(null as any);

export const ServerManager: FC = ({ children }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PreGame);
  const [serverRoomId, setServerRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [sendMessage, setSendMessage] = useState<(type: string | number, payload?: any) => void>(() => () => null);

  const onGameStatusUpdate = useCallback((gameStatus: GameStatus) => setGameStatus(gameStatus), []);

  useEffect(() => {
    initConnection(onGameStatusUpdate)
      .then(([roomId, sendMessage]) => {
        setIsConnected(true);
        setServerRoomId(roomId);
        setSendMessage(() => sendMessage);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isConnected) return null;

  return <ServerContext.Provider value={{ serverRoomId, gameStatus, sendMessage }}>{children}</ServerContext.Provider>
};

export const useServerState = () => {
  const { sendMessage, ...state } = useContext(ServerContext)
  return state;
};
export const useSendMessage = () => useContext(ServerContext).sendMessage;
