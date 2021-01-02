import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { GameState, DoActionMessage, CharacterActionSchema } from '../../../common';
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

    if (character.actionQueue.find(
      (a) => a.type === 'Plow' && a.coord.x === request.coord.x && a.coord.y === request.coord.y)
    ) {
      // ignore if action already exists
      return;
    }

    if (character.actionQueue[0] && character.actionQueue[0].type === 'Move') {
      character.actionQueue.shift();
    }

    character.actionQueue.push(new CharacterActionSchema().assign({
      type: 'Plow',
      coord: new CoordSchema().assign(request.coord),
    }));
  }
};
