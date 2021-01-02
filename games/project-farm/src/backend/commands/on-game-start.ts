import { Command, Dispatcher } from '@colyseus/command';

import { GameState } from '../../common';
import { createMap } from '../create-map';


export class OnGameStartCommand extends Command<GameState> {
  execute() {
    const state = new GameState();
    state.map.push(...createMap());
    this.room.setState(state);
  };
}
