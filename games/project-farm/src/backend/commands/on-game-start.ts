import { Command, Dispatcher } from '@colyseus/command';

import { GameState } from '../../common';
import { createMap } from '../create-map';


export class OnGameStartCommand extends Command<GameState, { dispatcher: Dispatcher }> {
  execute({ dispatcher }: { dispatcher: Dispatcher }) {

    const state = new GameState();
    state.map.push(...createMap());
    this.room.setState(state);

    // let tickNumber: number = 0;
    // this.clock.setInterval(() => {
    //   tickNumber++;
    //   dispatcher.dispatch(new OnTickCommand(), { tickNumber });
    // }, TICK_RATE);
  };
}
