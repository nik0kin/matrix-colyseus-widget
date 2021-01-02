import { Command } from '@colyseus/command';

import { GameState } from '../../common';
import { createMap } from '../create-map';


export class OnGameStartCommand extends Command<GameState> {
  execute() {
    const state = new GameState();
    state.customOptions.assign(this.room.metadata.customOptions);
    state.map.push(...createMap(state.customOptions));
    state.seedInventory.set('potato', 50);
    this.room.setState(state);
  };
}
