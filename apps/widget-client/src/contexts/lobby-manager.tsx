import { RoomAvailable, Room } from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';

import { RoomMetadata } from 'common';

import { client } from '../colyseus-client';

export type Rooms = RoomAvailable<RoomMetadata>[];

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

const startGame = async (gameId: string) => {
  const room = await client.create(gameId);

  console.log('Room joined: ' + room.id + ' ' + room.name);

  return room;
};

const joinGame = async (roomId: string) => {
  const room = await client.joinById(roomId);

  console.log('Room joined: ' + room.id + ' ' + room.name);

  return room;
};

interface LobbyManagerType {
  lobbyRoomId: string;
  sessionId: string;

  rooms: Rooms;
  joinedRooms: Room[];

  startGame: (gameId: string) => void;
  joinGame: (roomId: string) => void;
}

const LobbyContext = createContext<LobbyManagerType>(null as any);

export const LobbyManager: FC = ({ children }) => {
  const [lobbyRoomId, setLobbyRoomId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<Rooms>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);

  const _startGame = useCallback(async (gameId: string) => {
    const room = await startGame(gameId);
    setJoinedRooms((jr) => [...jr, room]);
  }, []);
  const _joinGame = useCallback(async (roomId: string) => {
    const room = await joinGame(roomId);
    setJoinedRooms((jr) => [...jr, room]);
  }, []);

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

