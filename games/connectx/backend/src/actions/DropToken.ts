import { ArraySchema } from '@colyseus/schema';

import { SpotSpace, DropTokenMessage } from '../common';
import { CustomSettings } from '../common/custom-settings';

export const validateQ = function (spots: ArraySchema<SpotSpace>, customSettings: CustomSettings, actionOwnerRel: string, actionParams: DropTokenMessage) {
  const xDropLocation = actionParams.xDropLocation,
    width = customSettings.width;

  if (!xDropLocation || !(xDropLocation >= 1 && xDropLocation <= width)) {
    throw 'xDropLocation must be in the valid range [1-' + width + ']';
  }

  const topXSpace = getSpace(spots, xDropLocation, 1);

  if (!topXSpace.open) {
    throw xDropLocation + ' column is full.';
  }
};

export const doQ = function (spots: ArraySchema<SpotSpace>, customSettings: CustomSettings, addToken: (x: number, y: number, ownerId: string) => void, actionOwnerRel: string, actionParams: DropTokenMessage) {
  const xDropLocation = actionParams.xDropLocation,
    height = customSettings.height;

  // drop the token by finding the lowest open space in that column
  let dropY = 1;
  while (dropY < height && getSpace(spots, xDropLocation, (dropY + 1)).open) {
    dropY++;
  }

  addToken(xDropLocation, dropY, actionOwnerRel);

  const droppedIntoSpace = getSpace(spots, xDropLocation, dropY);
  droppedIntoSpace.open = false;

  return {
    droppedToLocation: { x: xDropLocation, y: dropY }
  };
};

function getSpace(spots: ArraySchema<SpotSpace>, _x: number, _y: number) {
  return spots.find(({ x, y }) => x === _x && y === _y);
}
