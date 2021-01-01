
import { times } from 'lodash';

import { PlotSchema } from '../common';

const MAP_SIZE = { width: 40, height: 100 };

export function createMap() {
  const plots: PlotSchema[] = [];
  times(MAP_SIZE.width, (x) => {
    times(MAP_SIZE.height, (y) => {
      const plot = new PlotSchema();
      plot.coord.assign({ x, y });
      plots.push(plot);
    });
  });
  return plots;
}
