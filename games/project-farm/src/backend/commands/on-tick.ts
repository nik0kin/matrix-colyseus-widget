import { Command } from '@colyseus/command';

import { GameState, CharacterSchema, CHARACTER_SPEED } from '../../common';
import { Coord } from 'utils';


export class OnTickCommand extends Command<GameState, { deltaTime: number }> {
  execute({ deltaTime }: { deltaTime: number }) {

    this.state.characters.forEach((character) => {
      if (character.actionQueue[0]) {
        const action = character.actionQueue[0];
        switch (action.type) {
          case 'Move':
            moveCharacter(character, action.coord, deltaTime);
            break;
        }
      }
    });
  };
}

// Not perfect: movement to a nearby destination goes slooow
// slightly modified from https://gamedev.stackexchange.com/a/23449
function moveCharacter(character: CharacterSchema, dest: Coord, deltaTime: number) {
  let newX: number;
  let newY: number
  const delta_x = dest.x - character.coord.x;
  const delta_y = dest.y - character.coord.y;
  const goal_dist = Math.sqrt((delta_x * delta_x) + (delta_y * delta_y));
  const dist = CHARACTER_SPEED * (deltaTime / 1000);
  if (goal_dist > dist) {
    // const ratio = speed_per_tick / goal_dist;
    // const dist = CHARACTER_SPEED * (deltaTime / 1000);
    const x_move = dist * delta_x;
    const y_move = dist * delta_y;
    newX = x_move + character.coord.x;
    newY = y_move + character.coord.y;
  }
  else {
    newX = dest.x;
    newY = dest.y;
    character.actionQueue.shift();
  }

  // console.log('move from ', JSON.stringify(character.coord), JSON.stringify(dest));
  character.coord.assign({
    x: newX, // character.coord.x * deltaTime * CHARACTER_SPEED * directionX,
    y: newY, // character.coord.y * deltaTime * CHARACTER_SPEED * directionY,
  })
}
