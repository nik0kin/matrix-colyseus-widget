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

    // TODO ignore if another non-move action is in progress

    // TODO if a move action comes, replace current action

    const character = this.state.characters[0]; // TODO support multi characters
    // character.coord.assign(request.coord);


    character.actionQueue.setAt(0, new CharacterActionSchema().assign({
      type: 'Move',
      coord: new CoordSchema().assign(request.coord),
    }));
  }
};
