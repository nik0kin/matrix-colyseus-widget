import { RoomAvailable } from 'colyseus.js';
import React, { FC, useEffect, useState, useCallback, createContext, useContext } from 'react';

import { client } from '../colyseus-client';

interface RoomMetadata {
  game: string;
  players: string[];
}

export type Rooms = RoomAvailable<RoomMetadata>[];

const initConnection = async (
  onRoomsUpdate: (gameStatus: Rooms) => void,
) => {
  try {
    const lobby = await client.joinOrCreate('lobby');

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

    return [lobby.id] as const;
  } catch (e) {
    console.log('Could not join!');
    console.error(e);
    return Promise.reject('Fack');
  }
}

const startGame = async (gameId: string) => {
  const room = await client.create(gameId);

  console.log('Room joined: ' + room.id + ' ' + room.name);

  return [room.sessionId] as const;
};

const joinGame = async (roomId: string) => {
  const room = await client.joinById(roomId);

  console.log('Room joined: ' + room.id + ' ' + room.name);

  return [room.sessionId] as const;
};

interface LobbyManagerType {
  lobbyRoomId: string;
  sessionId: string;

  rooms: Rooms;

  startGame: (gameId: string) => void;
  joinGame: (roomId: string) => void;
}

const LobbyContext = createContext<LobbyManagerType>(null as any);

export const LobbyManager: FC = ({ children }) => {
  const [lobbyRoomId, setLobbyRoomId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<Rooms>([])

  const _startGame = useCallback(async (gameId: string) => {
    const [sessionId] = await startGame(gameId);
    setSessionId(sessionId);
  }, []);
  const _joinGame = useCallback(async (roomId: string) => {
    const [sessionId] = await joinGame(roomId);
    setSessionId(sessionId);
  }, []);

  const onRoomsUpdate = useCallback((rooms: Rooms) => setRooms(rooms), []);

  useEffect(() => {
    initConnection(onRoomsUpdate)
      .then(([roomId]) => {
        setIsConnected(true);
        setLobbyRoomId(roomId);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isConnected) return null;

  return <LobbyContext.Provider value={{
    lobbyRoomId, sessionId,
    rooms,
    startGame: _startGame, joinGame: _joinGame,
  }}>{children}</LobbyContext.Provider>
};

export const useLobbyState = () => {
  return useContext(LobbyContext);
};
