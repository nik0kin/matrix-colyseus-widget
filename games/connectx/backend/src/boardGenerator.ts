import { SpotSpace } from './common';

import { times } from 'lodash';

export const boardGeneratorHook = function (customBoardSettings: { width: number; height: number }) {
  var board: SpotSpace[] = [];

  times(customBoardSettings.width, function (x) {
    times(customBoardSettings.height, function (y) {
      board.push(new SpotSpace().assign({
        x: x + 1,
        y: y + 1,
        open: true,
      }));
    });
  });

  return board;
};

