import { PlayerSchema } from 'common';

export const AI_PLAYER_KEY = 'null';

export const getPlayerKey = (player?: PlayerSchema | false) => player ? player.id : AI_PLAYER_KEY;
