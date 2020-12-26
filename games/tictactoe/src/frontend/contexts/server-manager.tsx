import * as Colyseus from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';
import { GameStatus } from 'common';

import { GameState, gameName } from '../../common';

// eslint-disable-next-line no-restricted-globals
var client = new Colyseus.Client(`${location.protocol.includes('https') ? 'wss' : 'ws'}://localhost:2567`);

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

  const room = await client.joinOrCreate<GameState>(gameName);
  setReconnectData(room);
  return room;
};

const initConnection = async (
  onGameStatusUpdate: (gameStatus: GameStatus) => void,
  onSpotsUpdate: (spots: string[]) => void,
  onIsPlayersTurnUpdate: (isPlayersTurn: boolean) => void,
  onIsPlayerXUpdate: (isPlayerX: boolean) => void,
  onWinnerUpdate: (winner: string) => void,
) => {
  try {
    const room = await getRoom();

    room.onMessage('game-start', () => {
      onGameStatusUpdate(GameStatus.InProgress);
    });

    room.onStateChange.once((state) => {
      console.log("this is the first room state!", state);
      onGameStatusUpdate(state.status);
      onSpotsUpdate(state.spots);
      onIsPlayersTurnUpdate(state.nextTurn === room.sessionId);
      onIsPlayerXUpdate(state.xPlayer === room.sessionId);
      onWinnerUpdate(state.winner);
    });

    room.onStateChange((state) => {
      console.log("the room state has been updated:", state);
    });

    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        if (change.field === 'spots') {
          onSpotsUpdate(change.value);
        }
        if (change.field === 'nextTurn') {
          onIsPlayersTurnUpdate(change.value === room.sessionId);
        }
        if (change.field === 'xPlayer') {
          onIsPlayerXUpdate(change.value === room.sessionId);
        }
        if (change.field === 'status') {
          onGameStatusUpdate(change.value);
        }
        if (change.field === 'winner') {
          onWinnerUpdate(change.value);
        }
      });
    };

    // room.state.players.onAdd = (player, key) => {
    //   console.log(player, "has been added at", key);
    //   // onPlayerConnect(key);
    // };

    // room.state.players.onRemove = (player, key) => {
    //   console.log(player, "has been removed at", key);
    //   // onPlayerDisconnect(key);
    // };

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
  gameStatus: GameStatus;
  spots: string[];
  isPlayersTurn: boolean;
  isPlayerX: boolean;
  winner: string;

  sendMessage: (type: string | number, payload?: any) => void;
}

const ServerContext = createContext<ServerManagerType>(null as any);

export const ServerManager: FC = ({ children }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PreGame);
  const [spots, setSpots] = useState<string[]>([]);
  const [serverRoomId, setServerRoomId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isPlayersTurn, setIsPlayersTurn] = useState(false);
  const [isPlayerX, setIsPlayerX] = useState(false);
  const [winner, setWinner] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [sendMessage, setSendMessage] = useState<(type: string | number, payload?: any) => void>(() => () => null);

  const onGameStatusUpdate = useCallback((gameStatus: GameStatus) => setGameStatus(gameStatus), []);
  const onSpotsUpdate = useCallback((spots: string[]) => setSpots(spots), []);
  const onIsPlayersTurnUpdate = useCallback((isPlayersTurn: boolean) => setIsPlayersTurn(isPlayersTurn), []);
  const onIsPlayerXUpdate = useCallback((isPlayerX: boolean) => setIsPlayerX(isPlayerX), []);
  const onWinnerUpdate = useCallback((winner: string) => setWinner(winner), []);

  useEffect(() => {
    initConnection(onGameStatusUpdate, onSpotsUpdate, onIsPlayersTurnUpdate, onIsPlayerXUpdate, onWinnerUpdate)
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
    serverRoomId, sessionId, gameStatus,
    spots, isPlayersTurn, isPlayerX, winner,
    sendMessage
  }}>{children}</ServerContext.Provider>
};

export const useServerState = () => {
  const { sendMessage, ...state } = useContext(ServerContext)
  return state;
};
export const useSendMessage = () => useContext(ServerContext).sendMessage;
