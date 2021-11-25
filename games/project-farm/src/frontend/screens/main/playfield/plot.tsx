import c from 'classnames';
import React, { FC, useState, useEffect, useCallback } from 'react';

import {
  PlotSchema,
  MOVE_CHARACTER_REQUEST,
  MoveCharacterMessage,
  DoActionMessage,
  DO_ACTION_REQUEST,
  PlantSchema,
  getPlantConfig,
  PlantStageType,
  getPlantFromPlot,
} from '../../../../common';
import { useSendMessage, useClientState } from '../../../contexts';

export const Plot: FC<{
  plot: PlotSchema;
  selectedForAction?: boolean;
  selected?: boolean;
}> = ({ plot, selectedForAction, selected }) => {
  const plant = getPlantFromPlot(plot);
  const sendMessage = useSendMessage();
  const { setSelectedPlot } = useClientState();

  const onSingleClick = useCallback(() => {
    console.log('single click', plot.coord);
    const message: DoActionMessage = {
      coord: plot.coord,
    };
    sendMessage(DO_ACTION_REQUEST, message);
    setSelectedPlot(plot.coord);
  }, [plot, sendMessage, setSelectedPlot]);
  const onDoubleClick = useCallback(() => {
    console.log('double click', plot.coord);
    const message: MoveCharacterMessage = {
      coord: plot.coord,
    };
    sendMessage(MOVE_CHARACTER_REQUEST, message);
  }, [plot, sendMessage]);

  const onClick = useSimpleAndDoubleClick(onSingleClick, onDoubleClick);

  return (
    <div
      className={c('Plot', `type-${plot.dirt}`, {
        selected,
        selectedForAction,
      })}
      onClick={onClick}
    >
      <span />
      {plant && (
        <span
          className={c('Plant', `type-${plant.type}`, {
            seed: isSeed(plant),
            harvestable: plant.stage === PlantStageType.Harvestable,
            withered: plant.stage === PlantStageType.Withered,
          })}
        />
      )}
      {!!plot.actionTime && <span>{plot.actionTime - Date.now()}</span>}
    </div>
  );
};

function useSimpleAndDoubleClick(
  actionSimpleClick: () => void,
  actionDoubleClick: () => void,
  delay = 250
) {
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

  return () => setClick((prev) => prev + 1);
}

function isSeed(plant: PlantSchema) {
  const plantConfig = getPlantConfig(plant.type);
  return (
    plant.stage === PlantStageType.Growing &&
    plant.timeLeft > plantConfig.growTime * 0.75
  );
}
