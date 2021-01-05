import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { GameState, ChangeToolMessage, ToolType, getPlantConfigs } from '../../../common';

type Payload = { client: Client } & ChangeToolMessage;

export class ChangeToolRequestCommand extends Command<GameState, Payload> {
  execute({ client, ...request }: Payload) {
    if (!request.tool) { // TODO check coord bounds
      throw new Error('Bad action request');
    }

    if (!(request.tool === ToolType.Hoe || isValidPlant(request.tool))) {
      throw new Error('Invalid tool');
    }

    const character = this.state.characters[0]; // TODO support multi characters
    character.tool = request.tool;
  }
};

function isValidPlant(plantType: string) {
  return !!(getPlantConfigs() as any)[plantType];
}
