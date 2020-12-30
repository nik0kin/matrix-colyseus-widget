import { Room, Client, updateLobby } from 'colyseus';

// @ts-ignore
import fetch from 'node-fetch';

import { GameStatus, RoomMetadata, PlayerSchema } from 'common';
import { getRandomArrayElement } from 'utils';

import { DROP_TOKEN, DropTokenMessage, GameState, TokenPiece } from './common';
import { winConditionHook } from './winCondition';
import { validateQ, doQ } from './actions/DropToken';
import { boardGeneratorHook } from './boardGenerator';

const cache: Record<string, string> = {};

export class GameRoom extends Room<GameState, RoomMetadata> {
  maxClients = 2;
  autoDispose = false;

  async onAuth(client: Client, { matrixOpenIdAccessToken }: { matrixOpenIdAccessToken: string }) {
    if ((GameRoom as any).DEBUG) return 'DEV_USER';

    if (cache[matrixOpenIdAccessToken]) {
      // Already been authed
      return cache[matrixOpenIdAccessToken];
    }

    try {
      const resp = await (fetch as typeof window.fetch)('https://matrix.tgp.io' + '/_matrix/federation/v1/openid/userinfo' + '?access_token=' + matrixOpenIdAccessToken);
      const data = await resp.json();

      if (data.error || data.errcode) {
        throw data;
      }

      console.log('matrix lookup success', data);

      cache[matrixOpenIdAccessToken] = data.sub;

      return data.sub;
    } catch (e) {
      console.error('matrix lookup failed', e);
      return false;
    }
  }

  onCreate(options: any) {
    const { roomName, matrixOpenIdAccessToken, ...customOptions } = options;
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

  onJoin(client: Client, options: any, matrixName: string) {
    const meta: RoomMetadata = this.metadata!;

    meta.players.push({ id: client.sessionId, name: matrixName });
    this.state.players.push(new PlayerSchema().assign({ id: client.sessionId, name: matrixName }));

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

