import { Room, Client, updateLobby } from 'colyseus';
import { Dispatcher } from '@colyseus/command';

import { GameStatus, RoomMetadata, PlayerSchema, authWithMatrix, WidgetMatrixAuth } from 'common';

import { GameState, CharacterSchema, MOVE_CHARACTER_REQUEST } from '../common';
import { OnGameStartCommand } from './commands/on-game-start';
import { OnMoveRequestCommand } from './commands/requests/move';


export class GameRoom extends Room<GameState, RoomMetadata> {
  maxClients = 10;
  autoDispose = false;

  dispatcher = new Dispatcher(this);

  async onAuth(client: Client, { matrixOpenIdAccessToken, matrixServerName }: WidgetMatrixAuth): Promise<string | false> {
    return authWithMatrix(GameRoom, matrixOpenIdAccessToken, matrixServerName);
  }

  onCreate(options: any) {
    const { roomName, matrixOpenIdAccessToken, matrixServerName, ...customOptions } = options;

    const meta: RoomMetadata = {
      name: roomName,
      gameId: (GameRoom as any).gameId,
      gameStatus: GameStatus.InProgress,
      players: [],
      customOptions,
    };
    this.setMetadata(meta).then(() => updateLobby(this));

    this.dispatcher.dispatch(new OnGameStartCommand(), { dispatcher: this.dispatcher });

    this.onMessage(MOVE_CHARACTER_REQUEST, (client, message) => {
      this.dispatcher.dispatch(new OnMoveRequestCommand(), { client, ...message });
    });
  }

  onJoin(client: Client, options: any, matrixName: string) {
    const meta: RoomMetadata = this.metadata!;

    meta.players.push({ id: client.sessionId, name: client.sessionId });
    this.state.players.push(new PlayerSchema().assign({ id: client.sessionId, name: matrixName }));

    const character = new CharacterSchema();
    character.coord.assign({ x: 2, y: 2 });
    this.state.characters.push(character);

    this.setMetadata(meta).then(() => updateLobby(this));
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      await this.allowReconnection(client, 500);
    } catch (e) {
      // ignore failed reconnect
    }
  }
}

