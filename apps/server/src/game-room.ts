import { Room, Client } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import { updateLobby } from 'colyseus';

import { GameState } from 'common';

export class GameRoom extends Room {
  maxClients = 2;
  dispatcher = new Dispatcher(this);

  onCreate(options: any) {
    this.setState(new GameState());
  }

  onJoin(client: Client, options: any) {
    // this.dispatcher.dispatch(new OnJoinCommand(), { sessionId: client.sessionId, client });

    const meta = this.metadata || { game: 'TicTacToe', players: [] };
    meta.players.push(client.sessionId);

    this.setMetadata(meta).then(() => updateLobby(this));
  }

  async onLeave(client: Client, consented: boolean) {
    // this.dispatcher.dispatch(new OnLeaveCommand(), { client, sessionId: client.sessionId, consented });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
