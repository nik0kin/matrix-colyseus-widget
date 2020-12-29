import { ArraySchema } from '@colyseus/schema';
import { Room, Client, updateLobby } from 'colyseus';
import { CustomOptions, GameStatus, RoomMetadata } from 'common';
import { getRandomArrayElement, Coord, toArrayIndex } from 'utils';

import { DROP_TOKEN, DropTokenMessage, GameState, TokenPiece } from './common';
import { winConditionHook } from './winCondition';
import { validateQ, doQ } from './actions/DropToken';
import { boardGeneratorHook } from './boardGenerator';

export class GameRoom extends Room<GameState, RoomMetadata> {
  maxClients = 2;
  autoDispose = false;

  onCreate(options?: CustomOptions) {
    const state = new GameState();

    console.log('options supplied: ', options);

    if (options && Object.keys(options).length !== 3) throw new Error('options missing');

    state.customOptions.assign(options);

    state.spots.push(...boardGeneratorHook(state.customOptions));

    this.setState(state);

    this.onMessage(DROP_TOKEN, (client, message: DropTokenMessage) => {

      if (this.state.status !== GameStatus.InProgress) {
        // Game not in progress, ignore
        return;
      }

      try {
        validateQ(this.state.spots, state.customOptions, '', message);
      } catch (e) {
        // Invalid message
        console.log('ConnectX client attempting invalid move: ', message);
        console.error(e)
        return;
      }

      const addToken = (x: number, y: number, player: string) => {
        const newToken = new TokenPiece().assign({ x, y, ownerId: player });
        this.state.tokens.push(newToken);
      };

      const result = doQ(this.state.spots, state.customOptions, addToken, client.sessionId, message);

      this.state.nextTurn = client.sessionId === this.metadata.players[0]
        ? this.metadata.players[1]
        : this.metadata.players[0];

      const winner = winConditionHook(this.state.spots, this.state.tokens, state.customOptions, client.sessionId, result);
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
    const meta: RoomMetadata = this.metadata || { gameId: (GameRoom as any).gameId, players: [] };
    meta.players.push(client.sessionId);

    this.setMetadata(meta).then(() => updateLobby(this));

    if (meta.players.length === 2) {
      this.state.status = GameStatus.InProgress;
      this.state.p1Player = meta.players[0];
      this.state.nextTurn = getRandomArrayElement(meta.players);
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

