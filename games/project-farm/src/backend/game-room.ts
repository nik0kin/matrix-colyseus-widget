import { Room, Client, updateLobby } from 'colyseus';
import { Dispatcher } from '@colyseus/command';

import { GameStatus, RoomMetadata, PlayerSchema, authWithMatrix, WidgetMatrixAuth } from 'common';

import { GameState, CharacterSchema, MOVE_CHARACTER_REQUEST, DO_ACTION_REQUEST } from '../common';
import { OnGameStartCommand } from './commands/on-game-start';
import { OnTickCommand } from './commands/on-tick';
import { OnMoveRequestCommand } from './commands/requests/move';
import { OnDoActionRequestCommand } from './commands/requests/do-action';


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

    this.dispatcher.dispatch(new OnGameStartCommand());

    this.onMessage(MOVE_CHARACTER_REQUEST, (client, message) => {
      this.dispatcher.dispatch(new OnMoveRequestCommand(), { client, ...message });
    });
    this.onMessage(DO_ACTION_REQUEST, (client, message) => {
      this.dispatcher.dispatch(new OnDoActionRequestCommand(), { client, ...message });
    });

    this.setSimulationInterval((deltaTime) =>
      this.dispatcher.dispatch(new OnTickCommand(), { deltaTime })
    );
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

