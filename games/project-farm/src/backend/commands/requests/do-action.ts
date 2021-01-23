import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { CoordSchema } from 'common';
import { areCoordsEqual } from 'utils';

import {
  GameState, DoActionMessage, CharacterActionSchema,
  getPlotAtLocation, ToolType, ActionType, getPlantConfigs, PlantStageType, getPlantFromPlot
} from '../../../common';

type Payload = { client: Client } & DoActionMessage;

export class OnDoActionRequestCommand extends Command<GameState, Payload> {
  execute({ client, ...request }: Payload) {
    if (!request.coord) { // TODO check coord bounds
      throw new Error('Bad action request');
    }

    const character = this.state.characters[0]; // TODO support multi characters
    const type = getActionTypeFromTool(character.tool);

    const actionOnPlotIndex = character.actionQueue.findIndex(
      (a) => a.type !== ActionType.Move && areCoordsEqual(a.coord, request.coord)
    );
    if (actionOnPlotIndex !== -1) {
      // remove action if action on plot already exists
      character.actionQueue.splice(actionOnPlotIndex, 1);
      return;
    }

    const plot = getPlotAtLocation(this.state, request.coord);
    const plant = plot && getPlantFromPlot(plot);

    if (character.actionQueue[0] && character.actionQueue[0].type === ActionType.Move) {
      character.actionQueue.shift();
    }

    const newAction = new CharacterActionSchema().assign({
      type,
      coord: new CoordSchema().assign(request.coord),
    });

    if (character.tool === 'Hoe' && plant?.stage === PlantStageType.Withered) {
      newAction.type = ActionType.ClearWithered;
    } else if (plot?.dirt === 'Plowed' && plant?.stage === PlantStageType.Harvestable) {
      newAction.type = ActionType.Harvest;
    } else if (type === ActionType.Plant) {
      newAction.plantToPlant = character.tool;

      if (plot?.dirt !== 'Plowed' || plant || !this.state.seedInventory.get(newAction.plantToPlant)) return;
    } else if (type === ActionType.Plow) {
      if (plot?.dirt === 'Plowed') return;
    }

    character.actionQueue.push(newAction);
  }
};

function getActionTypeFromTool(tool: ToolType | string) {
  if ((getPlantConfigs() as any)[tool]) {
    return ActionType.Plant;
  }

  switch (tool) {
    case ToolType.Hoe: return ActionType.Plow;
    default:
      throw new Error('Invalid Tool');
  }
}
