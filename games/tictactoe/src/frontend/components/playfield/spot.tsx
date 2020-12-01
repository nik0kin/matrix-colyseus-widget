import React, { FC } from 'react';
import { Coord, toArrayIndex } from 'utils';

import { PLACE_MARK, PlaceMarkMessage } from '../../../common';
import { useServerState, useSendMessage } from '../../contexts';

export const Spot: FC<Coord> = ({ x, y }) => {
  const { spots } = useServerState();
  const sendMessage = useSendMessage();

  const onClick = () => {
    const message: PlaceMarkMessage = {
      coord: { x, y }
    };
    sendMessage(PLACE_MARK, message);
  };

  return (
    <div className="Spot" onClick={onClick}>
      {spots[toArrayIndex({ x, y })]}
    </div>
  );
};
