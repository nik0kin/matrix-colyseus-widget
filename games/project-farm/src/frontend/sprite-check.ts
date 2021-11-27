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
const cropStates = [
  PlantStageType.Growing,
  PlantStageType.Harvestable,
  PlantStageType.Withered,
];

const trees = ['NonFruitTree', 'AppleTree'];
const treeStates = [
  PlantStageType.Growing,
  PlantStageType.Fruiting,
  PlantStageType.Harvestable,
];

export const getSpriteCheckGameState = (): GameState => {
  const gs = new GameState();

  times(cropStates.length, (x) => {
    times(plants.length, (y) => {
      const p = new PlotSchema();
      p.dirt = 'Plowed';
      p.coord = new CoordSchema().assign({ x, y });
      gs.map.push(p);
      const plant = new PlantSchema();
      plant.type = plants[y];
      plant.stage = cropStates[x];
      p.plant[0] = plant;
    });
  });

  times(treeStates.length, (_x) => {
    times(trees.length, (y) => {
      const x = _x + cropStates.length + 1;
      const p = new PlotSchema();
      p.dirt = 'Plowed';
      p.coord = new CoordSchema().assign({ x, y });
      gs.map.push(p);
      const plant = new PlantSchema();
      plant.type = trees[y];
      plant.stage = treeStates[_x];
      p.plant[0] = plant;
    });
  });

  gs.characters[0] = new CharacterSchema();

  return gs;
};
