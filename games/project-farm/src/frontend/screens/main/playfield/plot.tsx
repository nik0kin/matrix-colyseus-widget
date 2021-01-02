import React, { FC, useState, useEffect, useCallback } from 'react';


import {
  PlotSchema, MOVE_CHARACTER_REQUEST, MoveCharacterMessage, DoActionMessage, DO_ACTION_REQUEST
} from '../../../../common';
import { useSendMessage } from '../../../contexts';

export const Plot: FC<{ plot: PlotSchema; selectedForAction?: boolean }> = ({ plot, selectedForAction }) => {
  const sendMessage = useSendMessage();

  const onSingleClick = useCallback(() => {
    console.log('single click', plot.coord)
    const message: DoActionMessage = {
      tool: 'Hoe',
      coord: plot.coord,
    };
    sendMessage(DO_ACTION_REQUEST, message);
  }, [plot, sendMessage]);
  const onDoubleClick = useCallback(() => {
    console.log('double click', plot.coord);
    const message: MoveCharacterMessage = {
      coord: plot.coord
    };
    sendMessage(MOVE_CHARACTER_REQUEST, message);
  }, [plot, sendMessage]);

  const onClick = useSimpleAndDoubleClick(onSingleClick, onDoubleClick);

  return (
    <div className={`Plot type-${plot.dirt} ${selectedForAction ? 'selected' : ''}`} onClick={onClick}>
      {plot.coord.x},{plot.coord.y}
      {!!plot.actionTime && <span>{plot.actionTime - Date.now()}</span>}
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
