import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import {
  GameState,
  BuySeedMessage,
  getPlantConfigs,
  PlantTypes,
  isValidPlant,
} from '../../../common';

type Payload = { client: Client } & BuySeedMessage;

export class BuySeedRequestCommand extends Command<GameState, Payload> {
  execute({ client, ...request }: Payload) {
    if (!request.amount || !request.type) {
      throw new Error('Bad action request');
    }

    if (!isValidPlant(request.type)) {
      throw new Error('Invalid type');
    }

    if (typeof request.amount !== 'number' || request.amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Can player afford it
    const price = getPrice(request.type, request.amount);
    if (this.state.karma < price) {
      throw new Error('Not enough karma');
    }

    // Buy Seed(s)
    const currentSeedCount = this.state.seedInventory.get(request.type) || 0;
    this.state.seedInventory.set(
      request.type,
      currentSeedCount + request.amount
    );
    this.state.karma -= price;
  }
}

function getPrice(type: string, amount: number) {
  return getPlantConfigs()[type as PlantTypes].cost * amount;
}
