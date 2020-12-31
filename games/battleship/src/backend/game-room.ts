import { Room, Client, updateLobby } from 'colyseus';

// @ts-ignore
import fetch from 'node-fetch';

import { GameStatus, RoomMetadata, PlayerSchema } from 'common';
import { getRandomArrayElement } from 'utils';

// import { DROP_TOKEN, DropTokenMessage, GameState, TokenPiece } from './common';
import {
  GameState, PLACE_SHIPS_MULE_ACTION, FIRE_SHOT_MULE_ACTION, FireShotMuleActionParams,
  getFireShotMuleActionFromParams, PlaceShipsMuleActionParams, getPlaceShipsMuleActionFromParams,
} from '../shared';
// import { winConditionHook } from './winCondition';
import fireShotCode from './actions/FireShot';
import placeShipsCode from './actions/PlaceShips';
import boardGeneratorHook from './hooks/boardGenerator';
import gameStartHook from './hooks/gameStart';
import validateTurnHook from './hooks/validateTurn';
import winConditionHook from './hooks/winCondition';

const cache: Record<string, string> = {};

export class GameRoom extends Room<GameState, RoomMetadata> {
  maxClients = 2;
  autoDispose = false;

  async onAuth(client: Client, { matrixOpenIdAccessToken }: { matrixOpenIdAccessToken: string }) {
    console.log('onAuth', (GameRoom as any).DEBUG)
    if ((GameRoom as any).DEBUG) return 'DEV_USER';

    if (cache[matrixOpenIdAccessToken]) {
      // Already been authed
      return cache[matrixOpenIdAccessToken];
    }

    try {
      const resp = await fetch('https://matrix.tgp.io' + '/_matrix/federation/v1/openid/userinfo' + '?access_token=' + matrixOpenIdAccessToken, {});
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

    const meta: RoomMetadata = {
      name: roomName,
      gameId: (GameRoom as any).gameId,
      gameStatus: GameStatus.PreGame,
      players: [],
      customOptions
    };
    this.setMetadata(meta).then(() => updateLobby(this));

    const state = new GameState();
    // state.customOptions.assign(meta.customOptions);
    state.squares.push(...boardGeneratorHook());
    this.setState(state);

    this.onMessage(FIRE_SHOT_MULE_ACTION, (client, message: FireShotMuleActionParams) => {
      const playerIndex = this.state.players.findIndex((p) => p.id === client.sessionId);
      const lobbyPlayerId = 'p' + (playerIndex + 1);

      if (this.state.status !== GameStatus.InProgress) {
        // Game not in progress, ignore
        return;
      }

      // TODO-fork make sure it's the correct players turn

      try {
        validateTurnHook(this.state, lobbyPlayerId, [getFireShotMuleActionFromParams(message)]);
      } catch (e) {
        // Invalid message
        console.log('Battleship client attempting invalid turn: ', message);
        console.error(e)
        return;
      }

      try {
        fireShotCode.validateQ(this.state, lobbyPlayerId, message);
      } catch (e) {
        // Invalid message
        console.log('Battleship client attempting invalid move: ', message);
        console.error(e)
        return;
      }

      const result = fireShotCode.doQ(this.state, lobbyPlayerId, message);
      this.broadcast(FIRE_SHOT_MULE_ACTION + '_meta', result);

      this.state.nextTurn = client.sessionId === this.metadata.players[0].id
        ? this.metadata.players[1].id
        : this.metadata.players[0].id;

      this.checkWin();
    });

    this.onMessage(PLACE_SHIPS_MULE_ACTION, (client, message: PlaceShipsMuleActionParams) => {
      const playerIndex = this.state.players.findIndex((p) => p.id === client.sessionId);
      const lobbyPlayerId = 'p' + (playerIndex + 1);

      if (this.state.status !== GameStatus.InProgress) {
        // Game not in progress, ignore
        return;
      }

      // TODO-fork make sure it's the correct players turn

      try {
        validateTurnHook(this.state, lobbyPlayerId, [getPlaceShipsMuleActionFromParams(message)]);
      } catch (e) {
        // Invalid message
        console.log('Battleship client attempting invalid turn: ', message);
        console.error(e)
        return;
      }

      try {
        placeShipsCode.validateQ(this.state, lobbyPlayerId, message);
      } catch (e) {
        // Invalid message
        console.log('Battleship client attempting invalid move: ', message);
        console.error(e)
        return;
      }

      const result = placeShipsCode.doQ(this.state, lobbyPlayerId, message);
      this.broadcast(PLACE_SHIPS_MULE_ACTION + '_meta', result);

      this.state.nextTurn = client.sessionId === this.metadata.players[0].id
        ? this.metadata.players[1].id
        : this.metadata.players[0].id;

      this.checkWin();
    });
  }

  checkWin() {
    const winner = winConditionHook(this.state);
    if (winner) {
      this.state.status = this.metadata.gameStatus = GameStatus.Finished;
      this.state.winner = winner;

      this.setMetadata(this.metadata).then(() => updateLobby(this));

      setTimeout(() => {
        this.disconnect();
      }, 1000 * 60 * 60 * 24);
    }
  }

  onJoin(client: Client, options: any, matrixName: string) {
    console.log('onJoin', matrixName)
    const meta: RoomMetadata = this.metadata!;

    meta.players.push({ id: client.sessionId, name: matrixName });
    this.state.players.push(new PlayerSchema().assign({ id: client.sessionId, name: matrixName }));

    if (meta.players.length === 2) {
      this.state.status = meta.gameStatus = GameStatus.InProgress;
      // this.state.p1Player = meta.players[0].id;
      this.state.nextTurn = getRandomArrayElement(meta.players).id;

      gameStartHook(this.state);
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

