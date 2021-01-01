
import { times } from 'lodash';

import { PlotSchema } from '../common';
import { getRandomInt } from 'utils';

const MAP_SIZE = { width: 30, height: 80 };

export function createMap() {
  const plots: PlotSchema[] = [];
  times(MAP_SIZE.width, (x) => {
    times(MAP_SIZE.height, (y) => {
      const plot = new PlotSchema();
      plot.coord.assign({ x, y });
      if (getRandomInt(0, 100) > 70) {
        plot.dirt = 'Weeded';
      }
      plots.push(plot);
    });
  });
  return plots;
}
