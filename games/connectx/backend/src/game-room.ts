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

  onCreate(options: any) {
    const { roomName, ...customOptions } = options;
    console.log('onCreate options supplied: ', options);
    if (customOptions && Object.keys(customOptions).length !== 3) throw new Error('options missing');

    const meta: RoomMetadata = {
      name: roomName,
      gameId: (GameRoom as any).gameId,
      gameStatus: GameStatus.PreGame,
      players: [],
      customOptions
    };
    this.setMetadata(meta).then(() => updateLobby(this));

    const state = new GameState();
    state.customOptions.assign(meta.customOptions);
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

      this.state.nextTurn = client.sessionId === this.metadata.players[0].id
        ? this.metadata.players[1].id
        : this.metadata.players[0].id;

      const winner = winConditionHook(this.state.spots, this.state.tokens, state.customOptions, client.sessionId, result);
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

  onJoin(client: Client, options: any) {
    const meta: RoomMetadata = this.metadata!;

    meta.players.push({ id: client.sessionId, name: client.sessionId });

    if (meta.players.length === 2) {
      this.state.status = meta.gameStatus = GameStatus.InProgress;
      this.state.p1Player = meta.players[0].id;
      this.state.nextTurn = getRandomArrayElement(meta.players).id;
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

