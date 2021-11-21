import {
  GameState,
  PlotSchema,
  PlantSchema,
  PlantStageType,
  CharacterSchema,
} from '../common';
import { times } from 'lodash';
import { CoordSchema } from 'common';

const plants = ['Potato', 'Sunflower', 'QuickCorn', 'SeedlessWatermelon'];
const states = [
  PlantStageType.Growing,
  PlantStageType.Harvestable,
  PlantStageType.Withered,
];

export const getSpriteCheckGameState = (): GameState => {
  const gs = new GameState();

  times(states.length, (x) => {
    times(plants.length, (y) => {
      const p = new PlotSchema();
      p.dirt = 'Plowed';
      p.coord = new CoordSchema().assign({ x, y });
      gs.map.push(p);
      const plant = new PlantSchema();
      plant.type = plants[y];
      plant.stage = states[x];
      p.plant[0] = plant;
    });
  });

  gs.characters[0] = new CharacterSchema();

  return gs;
};
