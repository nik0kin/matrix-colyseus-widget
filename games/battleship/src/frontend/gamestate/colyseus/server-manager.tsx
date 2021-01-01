import * as Colyseus from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';
import { useDispatch, useStore } from 'react-redux';

import { GameStatus } from 'common';

import { GameState, Action, PLACE_SHIPS_MULE_ACTION, FIRE_SHOT_MULE_ACTION } from '../../../shared';
import { loadMuleStateSuccess, loadNewTurn, setWinner } from '../../actions';
import { toFeGameState, toFeTurn } from './data';
import { StoreState } from '../../types';

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

  const room = await client.joinOrCreate<GameState>('tictactoe'); // matches id in mcw.config.js TODO pass in via env var?
  setReconnectData(room);
  return room;
};

const initConnection = async (
  onGameStatusUpdate: (gameStatus: GameStatus) => void,
  // onSpotsUpdate: (spots: string[]) => void,
  onGameStateUpdate: (gameState: GameState, sessionId: string, firstUpdate?: boolean) => void,
  onIsPlayersTurnUpdate: (isPlayersTurn: boolean) => void,
  // onIsPlayerXUpdate: (isPlayerX: boolean) => void,
  onWinnerUpdate: (winner: string) => void,
  onActionUpdate: (action: Action) => void
) => {
  try {
    const room = await getRoom();

    room.onStateChange.once((state) => {
      console.log("this is the first room state!", state);
      onGameStatusUpdate(state.status);
      onGameStateUpdate(state, room.sessionId, true);
      // onSpotsUpdate(state.spots);
      onIsPlayersTurnUpdate(state.nextTurn === room.sessionId);
      // onIsPlayerXUpdate(state.xPlayer === room.sessionId);
      onWinnerUpdate(state.winner);
    });

    room.onStateChange((state) => {
      console.log("the room state has been updated:", state);
      onGameStateUpdate(state, room.sessionId);
    });

    room.state.onChange = (changes) => {
      changes.forEach((change) => {
        // if (change.field === 'spots') {
        //   onSpotsUpdate(change.value);
        // }
        if (change.field === 'nextTurn') {
          onIsPlayersTurnUpdate(change.value === room.sessionId);
        }
        // if (change.field === 'xPlayer') {
        //   onIsPlayerXUpdate(change.value === room.sessionId);
        // }
        if (change.field === 'status') {
          onGameStatusUpdate(change.value);
        }
        if (change.field === 'winner') {
          onWinnerUpdate(change.value);
        }
      });
    };

    room.onMessage(PLACE_SHIPS_MULE_ACTION + '-complete', (action: Action) => {
      onActionUpdate(action);
    });

    room.onMessage(FIRE_SHOT_MULE_ACTION + '-complete', (action: Action) => {
      onActionUpdate(action);
    });

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
  // spots: string[];
  isPlayersTurn: boolean;
  // isPlayerX: boolean;
  winner: string;

  sendMessage: (type: string | number, payload?: any) => void;
}

const ServerContext = createContext<ServerManagerType>(null as any);

let recievingSoon = false;

export const ServerManager: FC = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore<StoreState>();

  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PreGame);
  // const [spots, setSpots] = useState<string[]>([]);
  const [serverRoomId, setServerRoomId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isPlayersTurn, setIsPlayersTurn] = useState(false);
  // const [isPlayerX, setIsPlayerX] = useState(false);
  const [winner, _setWinner] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [sendMessage, setSendMessage] = useState<(type: string | number, payload?: any) => void>(() => () => null);

  const onGameStatusUpdate = useCallback((gameStatus: GameStatus) => setGameStatus(gameStatus), []);
  // const onSpotsUpdate = useCallback((spots: string[]) => setSpots(spots), []);
  const onIsPlayersTurnUpdate = useCallback((isPlayersTurn: boolean) => setIsPlayersTurn(isPlayersTurn), []);
  // const onIsPlayerXUpdate = useCallback((isPlayerX: boolean) => setIsPlayerX(isPlayerX), []);
  const onWinnerUpdate = useCallback((winner: string) => {
    _setWinner(winner);
    if (winner) {
      dispatch(setWinner(winner));
    }
  }, []);
  const onGameStateUpdate = useCallback((gameState: GameState, sessionId: string, firstUpdate?: boolean) => {
    if (firstUpdate) {
      dispatch(loadMuleStateSuccess(toFeGameState(gameState, sessionId)));
    }
    if (recievingSoon) {
      const lastTurnWithAction = gameState.turns[gameState.turns.length - 1].playerTurns.size ? gameState.turns[gameState.turns.length - 1] : gameState.turns[gameState.turns.length - 2];
      dispatch(loadNewTurn(gameState.turns.length - 1, toFeTurn(lastTurnWithAction))); // TODO-fork, does `gameState.turns.length - 1` need to match above?
      recievingSoon = false;
    }
  }, []);
  const onActionUpdate = useCallback((action: Action) => {
    recievingSoon = true;
  }, [store]);

  useEffect(() => {
    initConnection(onGameStatusUpdate, onGameStateUpdate, onIsPlayersTurnUpdate, onWinnerUpdate, onActionUpdate)
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
    isPlayersTurn, winner,
    sendMessage
  }}>{children}</ServerContext.Provider>
};

export const useServerState = () => {
  const { sendMessage, ...state } = useContext(ServerContext)
  return state;
};
export const useSendMessage = () => useContext(ServerContext).sendMessage;
