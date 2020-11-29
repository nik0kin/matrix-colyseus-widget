import { Room, Client } from 'colyseus';
import { Dispatcher } from '@colyseus/command';

import { GameState } from 'common';


// const GAME_START_TIME = 2 * 1000 * 60; // 2min
const GAME_START_TIME = 30 * 1000;

export class GameRoom extends Room {
  maxClients = 20;
  dispatcher = new Dispatcher(this);

  onCreate(options: any) {
    this.setState(new GameState());
  }

  onJoin(client: Client, options: any) {
    // this.dispatcher.dispatch(new OnJoinCommand(), { sessionId: client.sessionId, client });
  }

  async onLeave(client: Client, consented: boolean) {
    // this.dispatcher.dispatch(new OnLeaveCommand(), { client, sessionId: client.sessionId, consented });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
