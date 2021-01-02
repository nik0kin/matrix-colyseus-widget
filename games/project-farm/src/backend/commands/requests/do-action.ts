import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { GameState, DoActionMessage, CharacterActionSchema, getPlotAtLocation } from '../../../common';
import { CoordSchema } from 'common';

type Payload = { client: Client } & DoActionMessage;

export class OnDoActionRequestCommand extends Command<GameState, Payload> {
  execute({ client, ...request }: Payload) {
    if (!request.coord || !request.tool) { // TODO check coord bounds
      throw new Error('Bad action request');
    }

    if (request.tool !== 'Hoe') {
      throw new Error('Wrong tool');
    }

    const character = this.state.characters[0]; // TODO support multi characters

    const actionOnPlotIndex = character.actionQueue.findIndex(
      (a) => a.type !== 'Move' && a.coord.x === request.coord.x && a.coord.y === request.coord.y
    );
    if (actionOnPlotIndex !== -1) {
      // remove action if action on plot already exists
      character.actionQueue.splice(actionOnPlotIndex, 1);
      return;
    }

    const plot = getPlotAtLocation(this.state, request.coord);
    if (plot?.dirt === 'Plowed') return;

    if (character.actionQueue[0] && character.actionQueue[0].type === 'Move') {
      character.actionQueue.shift();
    }

    character.actionQueue.push(new CharacterActionSchema().assign({
      type: 'Plow',
      coord: new CoordSchema().assign(request.coord),
    }));
  }
};
