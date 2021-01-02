import { Command } from '@colyseus/command';

import { GameState, CharacterSchema, CHARACTER_SPEED, PlotSchema, getPlotAtLocation } from '../../common';
import { Coord } from 'utils';

const ACTION_LENGTH = 1000;

export class OnTickCommand extends Command<GameState, { deltaTime: number }> {
  execute({ deltaTime }: { deltaTime: number }) {

    // Do character actions
    this.state.characters.forEach((character) => {
      if (character.actionQueue[0]) {
        const action = character.actionQueue[0];
        switch (action.type) {
          case 'Move':
            if (character.coord.x !== action.coord.x || character.coord.y !== action.coord.y) {
              moveCharacter(character, action.coord, deltaTime);
            }
            if (character.coord.x === action.coord.x && character.coord.y === action.coord.y) {
              character.actionQueue.shift();
            }
            break;
          case 'Plow':
            if (character.coord.x !== action.coord.x || character.coord.y !== action.coord.y) {
              moveCharacter(character, action.coord, deltaTime);
            }
            if (character.coord.x === action.coord.x && character.coord.y === action.coord.y) {
              const plot = getPlotAtLocation(this.state, action.coord)!;
              plow(plot, this.clock.currentTime);
              if (plot.actionTime === 0) {
                character.actionQueue.shift();
              }
            }
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
  const speed = goal_dist < CHARACTER_SPEED ? CHARACTER_SPEED * 4 : CHARACTER_SPEED; // speed up when close
  const dist = speed * (deltaTime / 1000);
  if (goal_dist > dist) {
    // if (goal_dist - dist > CHARACTER_SPEED * .4) { // go until close to location
    // const ratio = speed_per_tick / goal_dist;
    // const dist = CHARACTER_SPEED * (deltaTime / 1000);
    const x_move = dist * delta_x;
    const y_move = dist * delta_y;
    newX = x_move + character.coord.x;
    newY = y_move + character.coord.y;
  } else {
    // done moving
    newX = dest.x;
    newY = dest.y;
  }

  // console.log('move from ', JSON.stringify(character.coord), JSON.stringify(dest));
  character.coord.assign({
    x: newX, // character.coord.x * deltaTime * CHARACTER_SPEED * directionX,
    y: newY, // character.coord.y * deltaTime * CHARACTER_SPEED * directionY,
  })
}

function plow(plot: PlotSchema, currentTime: number) {
  if (plot.actionTime === 0) {
    // start plowing
    plot.actionTime = currentTime + ACTION_LENGTH;
  } else if (plot.actionTime < currentTime) {
    // end plowing
    if (plot.dirt === 'Weeded') {
      plot.dirt = 'Normal';
    } else if (plot.dirt === 'Normal') {
      plot.dirt = 'Plowed';
    }
    plot.actionTime = 0;
  }
}
