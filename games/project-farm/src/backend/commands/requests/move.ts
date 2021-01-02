import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { GameState, MoveCharacterMessage, CharacterActionSchema } from '../../../common';
import { CoordSchema } from 'common';

type Payload = { client: Client } & MoveCharacterMessage;

export class OnMoveRequestCommand extends Command<GameState, Payload> {
  execute({ client, ...request }: Payload) {
    if (!request.coord) { // TODO check coord bounds
      throw new Error('Bad move request');
    }

    const character = this.state.characters[0]; // TODO support multi characters

    if (character.actionQueue[0] && character.actionQueue[0].type !== 'Move') {
      // ignore if another non-move action is in progress
      return;
    }

    // replace current move action if applicable
    character.actionQueue.setAt(0, new CharacterActionSchema().assign({
      type: 'Move',
      coord: new CoordSchema().assign(request.coord),
    }));
  }
};
