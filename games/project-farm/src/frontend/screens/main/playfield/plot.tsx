import React, { FC } from 'react';
// import { Coord } from 'utils';

// import { useServerState } from '../../../contexts';
import { PlotSchema } from '../../../../common';

export const Plot: FC<{ plot: PlotSchema }> = ({ plot }) => {
  // const sendMessage = useSendMessage();

  // const onClick = () => {
  //   const message: PlaceMarkMessage = {
  //     coord: { x, y }
  //   };
  //   sendMessage(PLACE_MARK, message);
  // };

  return (
    <div className="Plot">
      {plot.coord.x},{plot.coord.y}
    </div>
  );
};
