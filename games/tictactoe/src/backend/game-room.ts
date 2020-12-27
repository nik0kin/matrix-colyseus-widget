import { ArraySchema } from '@colyseus/schema';
import { Room, Client, updateLobby } from 'colyseus';
import { GameStatus } from 'common';
import { getRandomArrayElement, Coord, toArrayIndex } from 'utils';

import { PLACE_MARK, PlaceMarkMessage, GameState } from '../common';
import { checkWin } from './check-win';


export class GameRoom extends Room<GameState> {
  maxClients = 2;
  autoDispose = false;

  onCreate(options: any) {
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

      this.state.nextTurn = client.sessionId === this.metadata.players[0]
        ? this.metadata.players[1]
        : this.metadata.players[0];

      const winner = checkWin(this.state.spots);
      if (winner) {
        this.state.status = GameStatus.Finished;
        this.state.winner = winner;

        setTimeout(() => {
          this.disconnect();
        }, 1000 * 60 * 60 * 24);
      }
    });
  }

  onJoin(client: Client, options: any) {
    const meta = this.metadata || { gameId: (GameRoom as any).gameId, players: [] };
    meta.players.push(client.sessionId);

    this.setMetadata(meta).then(() => updateLobby(this));

    if (meta.players.length === 2) {
      this.state.status = GameStatus.InProgress;
      this.state.nextTurn = getRandomArrayElement(meta.players);
      this.state.xPlayer = getRandomArrayElement(meta.players);
    }
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
