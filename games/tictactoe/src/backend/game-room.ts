import { ArraySchema } from '@colyseus/schema';
import { Room, Client, updateLobby } from 'colyseus';
import { GameStatus, RoomMetadata, PlayerSchema } from 'common';
import { getRandomArrayElement, Coord, toArrayIndex } from 'utils';

import { PLACE_MARK, PlaceMarkMessage, GameState } from '../common';
import { checkWin } from './check-win';


export class GameRoom extends Room<GameState, RoomMetadata> {
  maxClients = 2;
  autoDispose = false;

  onCreate(options: any) {
    const { roomName, ...customOptions } = options;

    const meta: RoomMetadata = {
      name: roomName,
      gameId: (GameRoom as any).gameId,
      gameStatus: GameStatus.PreGame,
      players: [],
      customOptions,
    };
    this.setMetadata(meta).then(() => updateLobby(this));

    const state = new GameState();
    state.spots.push('', '', '', '', '', '', '', '', '');
    this.setState(state);

    this.onMessage(PLACE_MARK, (client, message: PlaceMarkMessage) => {
      console.log(PLACE_MARK, JSON.stringify(message));

      if (this.state.status !== GameStatus.InProgress) {
        // Game not in progress, ignore
        return;
      }

      if (!message || !message.coord || isOutofBounds(message.coord.x) || isOutofBounds(message.coord.y)) {
        // Invalid message, ignore
        return;
      }

      if (client.sessionId !== this.state.nextTurn) {
        // Not players turn, ignore
        return;
      }

      if (this.state.spots[toArrayIndex(message.coord)]) {
        // Spot already taken, ignore
        return;
      }

      const mark = this.state.xPlayer === client.sessionId ? 'X' : 'O';
      modifySpot(this.state.spots, mark, message.coord);

      this.state.nextTurn = client.sessionId === this.metadata.players[0].id
        ? this.metadata.players[1].id
        : this.metadata.players[0].id;

      const winner = checkWin(this.state.spots);
      if (winner) {
        this.state.status = this.metadata.gameStatus = GameStatus.Finished;
        this.state.winner = winner;

        this.setMetadata(this.metadata).then(() => updateLobby(this));

        setTimeout(() => {
          this.disconnect();
        }, 1000 * 60 * 60 * 24);
      }
    });
  }

  onJoin(client: Client, options: any, matrixName: string) {
    const meta: RoomMetadata = this.metadata!;

    meta.players.push({ id: client.sessionId, name: client.sessionId });
    this.state.players.push(new PlayerSchema().assign({ id: client.sessionId, name: matrixName }));

    if (meta.players.length === 2) {
      this.state.status = meta.gameStatus = GameStatus.InProgress;
      this.state.nextTurn = getRandomArrayElement(meta.players).id;
      this.state.xPlayer = getRandomArrayElement(meta.players).id;
    }

    this.setMetadata(meta).then(() => updateLobby(this));
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      await this.allowReconnection(client, 500);
    } catch (e) {
      // ignore failed reconnect
    }
  }

  // onDispose() {
  // }
}

function isOutofBounds(num: number) {
  return num < 0 || num > 2;
}

function modifySpot(array: ArraySchema<string>, val: string, coord: Coord) {
  array[toArrayIndex(coord)] = val;
}
