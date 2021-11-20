import { Command } from '@colyseus/command';

import { GameState } from '../../common';
import { createMap } from '../create-map';

export class OnGameStartCommand extends Command<GameState> {
  execute() {
    const state = new GameState();
    state.customOptions.assign(this.room.metadata.customOptions);
    state.map.push(...createMap(state.customOptions));
    state.seedInventory.set('Potato', 15);

    if ((this.room as any).__proto__?.constructor?.DEBUG) {
      state.seedInventory.set('Potato', 50);
      state.seedInventory.set('TestPotato', 50);
      state.seedInventory.set('Sunflower', 50);
    }

    this.room.setState(state);
  }
}
