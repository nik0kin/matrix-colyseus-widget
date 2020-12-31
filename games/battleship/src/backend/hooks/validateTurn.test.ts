import { GameState, BattleshipPlayerVariablesSchema } from '../../shared';

import validateTurn from './validateTurn';
import { MapSchema } from '@colyseus/schema';

const newGameState = new GameState().assign({
  playerVariables: new MapSchema<BattleshipPlayerVariablesSchema>()
});
newGameState.playerVariables.set('p1', new BattleshipPlayerVariablesSchema().assign({
  hasPlacedShips: true,
}));

const validFireShotAction = {
  type: 'FireShot',
  params: {
    shot: { x: 1, y: 1 },
  },
};
const invalidPlaceShipsAction = {
  type: 'PlaceShips',
  params: {
    shipPlacements: [],
  },
};

describe('Hook: validateTurn', () => {
  it('should run without error', () => {
    validateTurn(newGameState, 'p1', [validFireShotAction]);
  });

  it('should fail because of too many actions', (done) => {
    try {
      validateTurn(newGameState, 'p1', [validFireShotAction, validFireShotAction]);
    } catch (e) {
      expect(e).toBeDefined();
      done();
    }
  });

  it('should fail because the player has already placed ships', (done) => {
    try {
      validateTurn(newGameState, 'p1', [invalidPlaceShipsAction]);
    } catch (e) {
      expect(e).toBeDefined();
      done();
    }
  });
});
