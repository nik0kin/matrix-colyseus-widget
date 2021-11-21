import { Coord } from 'utils';

export const MOVE_CHARACTER_REQUEST = 'MOVE_CHARACTER_REQUEST';

export interface MoveCharacterMessage {
  coord: Coord;
}

export const DO_ACTION_REQUEST = 'DO_ACTION_REQUEST';

// rename to QueueAction?
export interface DoActionMessage {
  coord: Coord;
  // tool: string; // uses current tool
}

export const CHANGE_TOOL_REQUEST = 'CHANGE_TOOL_REQUEST';

export interface ChangeToolMessage {
  tool: string;
}

export const BUY_SEED = 'BUY_SEED';

export interface BuySeedMessage {
  type: string;
  amount: number;
}

export const UNLOCK_SEED = 'UNLOCK_SEED';

export interface UnlockSeedMessage {
  type: string;
}
