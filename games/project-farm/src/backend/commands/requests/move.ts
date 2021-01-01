import { Command } from '@colyseus/command';
import { Client } from 'colyseus';

import { GameState, MoveCharacterMessage } from '../../../common';

type Payload = { client: Client } & MoveCharacterMessage;

export class OnMoveRequestCommand extends Command<GameState, Payload> {
  execute({ client, ...request }: Payload) {
    if (!request.coord) { // TODO check coord bounds
      throw new Error('Bad move request');
    }

    const character = this.state.characters[0]; // TODO support multi characters
    character.coord.assign(request.coord);
  }
};
