import { Command } from '@colyseus/command';

import { Coord, areCoordsEqual, getRandomInt } from 'utils';

import {
  GameState,
  CharacterSchema,
  CHARACTER_SPEED,
  DEFAULT_HARVEST_LENGTH,
  PlotSchema,
  getPlotAtLocation,
  ActionType,
  PlantSchema,
  PlantStageType,
  getPlantConfig,
  getPlantFromPlot,
  removePlantFromPlot,
  PlantConfig,
} from '../../common';

const ACTION_LENGTH = 1000;

export class OnTickCommand extends Command<GameState, { deltaTime: number }> {
  execute({ deltaTime }: { deltaTime: number }) {
    const isDebug = !!(this.room as any).__proto__?.constructor?.DEBUG;

    // Do character actions
    this.state.characters.forEach((character) => {
      if (character.actionQueue[0]) {
        const action = character.actionQueue[0];
        const plot = getPlotAtLocation(this.state, action.coord)!;
        const plant = getPlantFromPlot(plot);
        switch (action.type) {
          case ActionType.Move:
            if (!areCoordsEqual(character.coord, action.coord)) {
              moveCharacter(character, action.coord, deltaTime);
            }
            if (areCoordsEqual(character.coord, action.coord)) {
              character.actionQueue.shift();
            }
            break;
          case ActionType.Plow:
            if (!areCoordsEqual(character.coord, action.coord)) {
              moveCharacter(character, action.coord, deltaTime);
            }
            if (areCoordsEqual(character.coord, action.coord)) {
              plow(plot, this.clock.currentTime);
              if (plot.actionTime === 0) {
                character.actionQueue.shift();
              }
            }
            break;
          // case ActionType.Chop:
          //   // NYI
          //   break;
          case ActionType.Plant:
            if (!this.state.seedInventory.get(action.plantToPlant!)) {
              // Out of seeds, stop action
              character.actionQueue.shift();
              return;
            }
            if (!areCoordsEqual(character.coord, action.coord)) {
              moveCharacter(character, action.coord, deltaTime);
            }
            if (areCoordsEqual(character.coord, action.coord)) {
              const plantConfig = getPlantConfig(action.plantToPlant!);
              // console.log('planting ', plantConfig);
              plot.plant.push(
                new PlantSchema().assign({
                  type: plantConfig.type,
                  stage: PlantStageType.Growing,
                  timeLeft: getGrowTime(plantConfig, isDebug),
                })
              );
              // console.log('just planted', plot.plant.toJSON());
              const seedsLeft =
                this.state.seedInventory.get(plantConfig.type) - 1;
              this.state.seedInventory.set(plantConfig.type, seedsLeft);
              character.actionQueue.shift();
            }
            break;
          case ActionType.Harvest:
            if (!plant || plant.stage !== PlantStageType.Harvestable) {
              // Plot has been harvested, stop action
              character.actionQueue.shift();
              return;
            }
            if (!areCoordsEqual(character.coord, action.coord)) {
              moveCharacter(character, action.coord, deltaTime);
            }
            if (areCoordsEqual(character.coord, action.coord)) {
              const plantConfig = getPlantConfig(plant.type);
              const [minSeeds, maxSeeds] = plantConfig.seedsOnHarvest;
              const seedsLeft =
                this.state.seedInventory.get(plantConfig.type) +
                getRandomInt(minSeeds, maxSeeds);
              this.state.seedInventory.set(plantConfig.type, seedsLeft);
              this.state.karma += plantConfig.feeds;
              this.state.peopleFed += plantConfig.feeds;

              if (plantConfig.subtype === 'Tree') {
                const plant = getPlantFromPlot(plot);
                if (!plant) throw new Error('Expected tree at plot');

                plant.stage = PlantStageType.Fruiting;
                plant.timeLeft = getFruitingTime(plantConfig, isDebug);
              } else {
                removePlantFromPlot(plot);
              }
            }
            break;
          case ActionType.ClearWithered:
            if (!plant || plant.stage !== PlantStageType.Withered) {
              // Plot doesnt have a plant, stop action
              character.actionQueue.shift();
              return;
            }

            if (!areCoordsEqual(character.coord, action.coord)) {
              moveCharacter(character, action.coord, deltaTime);
            }
            if (areCoordsEqual(character.coord, action.coord)) {
              removePlantFromPlot(plot);
              plot.dirt = 'Normal';
            }
            break;
        }
      }
    });

    // Grow plants
    this.state.map.forEach((plot) => {
      const plant = getPlantFromPlot(plot);
      if (plant && plant.stage !== PlantStageType.Withered) {
        const config = getPlantConfig(plant.type);
        // console.log('growing', plant.toJSON());
        // const plantConfig = getPlantConfig(plant.type);
        plant.timeLeft -= deltaTime;
        if (plant.timeLeft <= 0 && plant.stage === PlantStageType.Growing) {
          // Harvest
          plant.stage =
            config.subtype === 'Tree'
              ? PlantStageType.Fruiting
              : PlantStageType.Harvestable;
          plant.timeLeft =
            config.subtype === 'Tree'
              ? getFruitingTime(config, isDebug)
              : getHarvestTime(config, isDebug);
        } else if (
          plant.timeLeft <= 0 &&
          plant.stage === PlantStageType.Fruiting &&
          config.harvestTime !== -1
        ) {
          plant.stage = PlantStageType.Harvestable;
          plant.timeLeft = 0; // Tree Fruit always harvestable
        } else if (
          plant.timeLeft <= 0 &&
          plant.stage === PlantStageType.Harvestable
        ) {
          if (config.subtype !== 'Tree') {
            plant.stage = PlantStageType.Withered;
          }
          plant.timeLeft = 0;
        }
      }
    });
  }
}

// Not perfect: movement to a nearby destination goes slooow
// slightly modified from https://gamedev.stackexchange.com/a/23449
function moveCharacter(
  character: CharacterSchema,
  dest: Coord,
  deltaTime: number
) {
  let newX: number;
  let newY: number;
  const delta_x = dest.x - character.coord.x;
  const delta_y = dest.y - character.coord.y;
  const goal_dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
  const speed =
    goal_dist < CHARACTER_SPEED ? CHARACTER_SPEED * 4 : CHARACTER_SPEED; // speed up when close
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
  });
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

const getGrowTime = (config: PlantConfig, isRealTime?: boolean) => {
  const growTime = config.growTime;

  if (isRealTime) return growTime / 10;

  return growTime;
};

const getHarvestTime = (config: PlantConfig, isRealTime?: boolean) => {
  const harvestTime = config.harvestTime || DEFAULT_HARVEST_LENGTH;

  if (isRealTime) return harvestTime / 5;

  return harvestTime;
};

const getFruitingTime = (config: PlantConfig, isRealTime?: boolean) => {
  const harvestTime = config.harvestTime || DEFAULT_HARVEST_LENGTH;

  if (isRealTime) return harvestTime / 15;

  return harvestTime;
};
