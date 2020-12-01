import * as Colyseus from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';
import { GameStatus } from 'common';

import { GameState, gameName } from '../../common';

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

  const room = await client.joinOrCreate<GameState>(gameName);
  setReconnectData(room);
  return room;
};

const initConnection = async (
  onGameStatusUpdate: (gameStatus: GameStatus) => void,
  onSpotsUpdate: (spots: string[]) => void,
  onNextTurnUpdate: (nextTurn: string) => void,
  onXPlayerUpdate: (xPlayer: string) => void,
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
      onNextTurnUpdate(state.nextTurn);
      onXPlayerUpdate(state.xPlayer);
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
          onNextTurnUpdate(change.value);
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
  gameStatus: GameStatus;
  spots: string[];
  nextTurn: string;
  xPlayer: string;
  winner: string;

  sendMessage: (type: string | number, payload?: any) => void;
}

const ServerContext = createContext<ServerManagerType>(null as any);

export const ServerManager: FC = ({ children }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PreGame);
  const [spots, setSpots] = useState<string[]>([]);
  const [serverRoomId, setServerRoomId] = useState('');
  const [nextTurn, setNextTurn] = useState('');
  const [xPlayer, setXPlayer] = useState('');
  const [winner, setWinner] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [sendMessage, setSendMessage] = useState<(type: string | number, payload?: any) => void>(() => () => null);

  const onGameStatusUpdate = useCallback((gameStatus: GameStatus) => setGameStatus(gameStatus), []);
  const onSpotsUpdate = useCallback((spots: string[]) => setSpots(spots), []);
  const onNextTurnUpdate = useCallback((nextTurn: string) => setNextTurn(nextTurn), []);
  const onXPlayerUpdate = useCallback((xPlayer: string) => setXPlayer(xPlayer), []);
  const onWinnerUpdate = useCallback((winner: string) => setWinner(winner), []);

  useEffect(() => {
    initConnection(onGameStatusUpdate, onSpotsUpdate, onNextTurnUpdate, onXPlayerUpdate, onWinnerUpdate)
      .then(([roomId, sendMessage]) => {
        setIsConnected(true);
        setServerRoomId(roomId);
        setSendMessage(() => sendMessage);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isConnected) return null;

  return <ServerContext.Provider value={{
    serverRoomId, gameStatus, spots, nextTurn, xPlayer, winner,
    sendMessage
  }}>{children}</ServerContext.Provider>
};

export const useServerState = () => {
  const { sendMessage, ...state } = useContext(ServerContext)
  return state;
};
export const useSendMessage = () => useContext(ServerContext).sendMessage;
