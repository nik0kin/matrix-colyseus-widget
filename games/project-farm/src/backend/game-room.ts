import { Room, Client, updateLobby } from 'colyseus';
import { Dispatcher } from '@colyseus/command';

import { GameStatus, RoomMetadata, PlayerSchema, authWithMatrix, WidgetMatrixAuth } from 'common';
import { getRandomInt } from 'utils';

import { GameState, CharacterSchema, MOVE_CHARACTER_REQUEST, DO_ACTION_REQUEST, CHANGE_TOOL_REQUEST } from '../common';
import { OnGameStartCommand } from './commands/on-game-start';
import { OnTickCommand } from './commands/on-tick';
import { OnMoveRequestCommand } from './commands/requests/move';
import { OnDoActionRequestCommand } from './commands/requests/do-action';
import { ChangeToolRequestCommand } from './commands/requests/change-tool';


export class GameRoom extends Room<GameState, RoomMetadata> {
  maxClients = 10;
  autoDispose = false;

  dispatcher = new Dispatcher(this);

  async onAuth(client: Client, { matrixOpenIdAccessToken, matrixServerName }: WidgetMatrixAuth): Promise<string | false> {
    return authWithMatrix(GameRoom, matrixOpenIdAccessToken, matrixServerName);
  }

  onCreate(options: any) {
    const { roomName, matrixOpenIdAccessToken, matrixServerName, ...customOptions } = options;
    console.log('onCreate options supplied: ', options);
    if (customOptions && Object.keys(customOptions).length !== 2) throw new Error('options missing');

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
    this.onMessage(CHANGE_TOOL_REQUEST, (client, message) => {
      this.dispatcher.dispatch(new ChangeToolRequestCommand(), { client, ...message });
    });

    this.setSimulationInterval((deltaTime) =>
      this.dispatcher.dispatch(new OnTickCommand(), { deltaTime })
    );

    this.clock.setInterval(() => {
      // Randomly Turn Dirt into Weeds
      this.state.map.forEach((plot) => {
        if (plot.dirt === 'Normal') {
          if (getRandomInt(0, 10000) > 9958) {
            plot.dirt = 'Weeded';
          }
        }
      });
    }, 30 * 1000); // every 30 seconds
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

