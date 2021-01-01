import React, { FC, useState, useEffect, useCallback } from 'react';
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

  const onSingleClick = useCallback(() => {
    console.log('single click', plot.coord)
  }, [plot]);
  const onDoubleClick = useCallback(() => {
    console.log('double click', plot.coord)
  }, [plot]);

  const onClick = useSimpleAndDoubleClick(onSingleClick, onDoubleClick);

  return (
    <div className={`Plot type-${plot.dirt}`} onClick={onClick}>
      {plot.coord.x},{plot.coord.y}
    </div>
  );
};

function useSimpleAndDoubleClick(actionSimpleClick: () => void, actionDoubleClick: () => void, delay = 250) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // simple click
      if (click === 1) actionSimpleClick();
      setClick(0);
    }, delay);

    // the duration between this click and the previous one
    // is less than the value of delay = double-click
    if (click === 2) actionDoubleClick();

    return () => clearTimeout(timer);

  }, [click, actionSimpleClick, actionDoubleClick, delay]);

  return () => setClick(prev => prev + 1);
}
