import { LiteHistory, SDK, Turn } from 'mule-sdk-js';

import { getGameId, getSdk } from './data';

export interface NewTurnAndWinner {
  newTurnExists: boolean;
  winner: string | undefined;
}

export async function checkForNewTurnAndWinner(currentTurn: number): Promise<NewTurnAndWinner> {
  const sdk: SDK = getSdk();

  if (!sdk) return { newTurnExists: false, winner: undefined }; // TODO make saga not start checking til game is loaded

  const history: LiteHistory = await sdk.Historys.readGamesHistoryQ(getGameId());

  return {
    newTurnExists: history.currentTurn !== currentTurn,
    winner: history.winner,
  };
}

export async function getNewTurn(turnNumber: number): Promise<Turn> {
  return await getSdk().Turns.readGamesTurnQ(getGameId(), turnNumber);
}

