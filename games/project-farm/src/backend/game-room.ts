import { Room, Client, updateLobby } from 'colyseus';
import { GameStatus, RoomMetadata, PlayerSchema, authWithMatrix, WidgetMatrixAuth } from 'common';

import { GameState, CharacterSchema } from '../common';
import { createMap } from './create-map';


export class GameRoom extends Room<GameState, RoomMetadata> {
  maxClients = 10;
  autoDispose = false;

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

    const state = new GameState();
    state.map.push(...createMap());
    this.setState(state);
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

