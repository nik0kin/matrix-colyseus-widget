import { ArraySchema } from '@colyseus/schema';

import { PlayerSchema } from 'common';

import { GameState } from '../../shared';

import gameStart from './gameStart';


describe('Hook: gameStart', () => {
  it('should run without error', () => {
    const gameState = new GameState();
    gameState.players = new ArraySchema<PlayerSchema>(new PlayerSchema(), new PlayerSchema());

    gameStart(gameState);
  });

  it('should create 14 ships', () => {
    const gameState = new GameState();
    gameState.players = new ArraySchema<PlayerSchema>(new PlayerSchema(), new PlayerSchema());

    gameStart(gameState);
    expect(gameState.ships.length).toBe(14);
  });
});
