
import { times } from 'lodash';
import { getRandomInt } from 'utils';

import { PlotSchema } from '../common';
import { CustomOptions } from './custom-options';

export function createMap(customOptions: CustomOptions) {
  const plots: PlotSchema[] = [];
  times(customOptions.height, (y) => {
    times(customOptions.width, (x) => {
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
