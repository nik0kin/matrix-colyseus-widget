import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import {
  GameState,
  UnlockSeedMessage,
  getPlantConfigs,
  PlantTypes,
  isValidPlant,
} from '../../../common';

type Payload = { client: Client } & UnlockSeedMessage;

export class UnlockSeedRequestCommand extends Command<GameState, Payload> {
  execute({ client, ...request }: Payload) {
    if (!request.type) {
      throw new Error('Bad action request');
    }

    if (!isValidPlant(request.type)) {
      throw new Error('Invalid type');
    }

    // Can player afford it
    const price = getRequirementPrice(request.type);
    if (this.state.karma < price) {
      throw new Error('Not enough karma');
    }

    // Is not unlocked
    if (price <= 0 || this.state.seedsUnlocked.includes(request.type)) {
      throw new Error('Seed doesnt have requirement or is already unlocked');
    }

    // Unlock Seed
    this.state.seedsUnlocked.push(request.type);
    this.state.karma -= price;
  }
}

function getRequirementPrice(type: string) {
  return getPlantConfigs()[type as PlantTypes].requirement?.karma || 0;
}
