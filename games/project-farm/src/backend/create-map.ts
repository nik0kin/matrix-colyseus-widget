import { times } from 'lodash';
import { getRandomInt } from 'utils';

import {
  PlotSchema,
  PlantSchema,
  getPlantConfig,
  PlantStageType,
} from '../common';
import { CustomOptions } from './custom-options';

const nonFruitTree = getPlantConfig('NonFruitTree');

export function createMap(customOptions: CustomOptions) {
  const plots: PlotSchema[] = [];
  times(customOptions.height, (y) => {
    times(customOptions.width, (x) => {
      const plot = new PlotSchema();
      plot.coord.assign({ x, y });
      if (getRandomInt(0, 100) <= 30) {
        plot.dirt = 'Weeded';
      }
      if (
        isNearEdge(x, y, customOptions.width, customOptions.height) &&
        getRandomInt(0, 100) <= 60
      ) {
        plot.plant.push(
          new PlantSchema().assign({
            type: nonFruitTree.type,
            stage: PlantStageType.Fruiting,
            timeLeft: 0,
          })
        );
      }
      plots.push(plot);
    });
  });
  return plots;
}

const NEAR_EDGE_LENGTH = 5;

const isNearEdge = (x: number, y: number, width: number, height: number) => {
  if (x - NEAR_EDGE_LENGTH < 0) return true;
  if (x + NEAR_EDGE_LENGTH >= width) return true;
  if (y - NEAR_EDGE_LENGTH < 0) return true;
  if (y + NEAR_EDGE_LENGTH >= height) return true;
  return false;
};
