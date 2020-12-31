import { RoomAvailable, Room } from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';

import { RoomMetadata } from 'common';

import { client } from '../colyseus-client';
import { useMatrixAuth } from './matrix-widget-manager';

export type Rooms = RoomAvailable<RoomMetadata>[];

export interface SlimRoom { id: string; sessionId: string; }

const setReconnectData = (room: Room) => {
  sessionStorage.setItem('lastLobbyRoomId', room.id);
  sessionStorage.setItem('lastSessionId', room.sessionId);
};

const getLobbyRoom = async () => {
  const lastLobbyRoomId = sessionStorage.getItem('lastLobbyRoomId');
  const lastSessionId = sessionStorage.getItem('lastSessionId');

  // RECONNECT TO LOBBY NOT CURRENT SUPPORTED?

  // Attempt reconnect
  if (lastLobbyRoomId && lastSessionId) {
    try {
      const room = await client.reconnect(lastLobbyRoomId, lastSessionId);
      setReconnectData(room);
      return room;
    } catch (e) {
      // ignore
    }
  }

  const room = await client.joinOrCreate('lobby');
  setReconnectData(room);
  return room;
};

const saveJoinedGames = (joinedGames: Array<SlimRoom>) => {
  sessionStorage.setItem('joinedGames', JSON.stringify(
    joinedGames.map(({ id, sessionId }) => ({ id, sessionId }))
  ));
};

const initConnection = async (
  onRoomsUpdate: (gameStatus: Rooms) => void,
) => {
  try {
    const lobby = await getLobbyRoom();

    let allRooms: Rooms = [];

    lobby.onMessage('rooms', (rooms) => {
      allRooms = rooms;
      onRoomsUpdate(allRooms);
    });

    lobby.onMessage('+', ([roomId, room]) => {
      const roomIndex = allRooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        allRooms[roomIndex] = room;

      } else {
        allRooms.push(room);
      }
      console.log('lobby.onMessage(+), ', roomId, room);
      onRoomsUpdate([...allRooms]);
    });

    lobby.onMessage('-', (roomId) => {
      allRooms = allRooms.filter((room) => room.roomId !== roomId);
      onRoomsUpdate(allRooms);
    });

    return [lobby.sessionId, lobby.id] as const;
  } catch (e) {
    console.log('Could not join!');
    console.error(e);
    return Promise.reject('Fack');
  }
}

const startGame = async (gameId: string, customOptions?: any) => {
  const room = await client.create(gameId, customOptions);

  console.log('Room joined: ' + room.id + ' ' + room.name);

  return room;
};

const joinGame = async (roomId: string, customOptions?: any) => {
  const room = await client.joinById(roomId, customOptions);

  console.log('Room joined: ' + room.id + ' ' + room.name);

  return room;
};

interface LobbyManagerType {
  lobbyRoomId: string;
  sessionId: string;

  rooms: Rooms;
  joinedRooms: Array<SlimRoom | Room>;

  startGame: (gameId: string, customOptions?: any) => void;
  joinGame: (roomId: string) => void;
}

const LobbyContext = createContext<LobbyManagerType>(null as any);

export const LobbyManager: FC = ({ children }) => {
  const [matrixOpenIdAccessToken, matrixServerName] = useMatrixAuth();

  const [lobbyRoomId, setLobbyRoomId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<Rooms>([]);
  const [joinedRooms, setJoinedRooms] = useState<Array<Room | SlimRoom>>(() => {
    const value = sessionStorage.getItem('joinedGames');
    return value ? JSON.parse(value) : [];
  });

  const _startGame = useCallback(async (gameId: string, customOptions?: any) => {
    const room = await startGame(gameId, { ...customOptions, matrixOpenIdAccessToken, matrixServerName });
    setJoinedRooms((jr) => [...jr, room]);
  }, [matrixOpenIdAccessToken, matrixServerName]);
  const _joinGame = useCallback(async (roomId: string) => {
    const room = await joinGame(roomId, { matrixOpenIdAccessToken, matrixServerName });
    setJoinedRooms((jr) => [...jr, room]);
  }, [matrixOpenIdAccessToken, matrixServerName]);

  useEffect(() => {
    saveJoinedGames(joinedRooms);
  }, [joinedRooms]);

  const onRoomsUpdate = useCallback((rooms: Rooms) => setRooms(rooms), []);

  useEffect(() => {
    initConnection(onRoomsUpdate)
      .then(([sessionId, roomId]) => {
        setIsConnected(true);
        setSessionId(sessionId);
        setLobbyRoomId(roomId);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isConnected) return null;

  return <LobbyContext.Provider value={{
    lobbyRoomId, sessionId,
    rooms, joinedRooms,
    startGame: _startGame, joinGame: _joinGame,
  }}>{children}</LobbyContext.Provider>
};

export const useLobbyState = () => {
  return useContext(LobbyContext);
};

export const useGetJoinedRoom = () => {
  const { joinedRooms } = useContext(LobbyContext);
  return (roomId: string) => {
    return joinedRooms.find((r) => roomId === r.id);
  };
};

