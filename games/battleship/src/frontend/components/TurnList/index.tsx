import * as React from 'react';
import { each, map } from 'lodash';

import {
  FireShotMuleActionMetaData, getBattleshipCoordString,
  PLACE_SHIPS_MULE_ACTION, Action, Turn,
} from '../../../shared';

import './style.css';

export interface Props {
  currentLobbyPlayerId: string;
  opponentName: string;
  previousTurns: Turn[];
}

function TurnList({
  currentLobbyPlayerId,
  opponentName,
  previousTurns,
}: Props) {


  return (
    <div className="TurnList">
      {getTurnList(currentLobbyPlayerId, opponentName, previousTurns.slice().reverse())}
    </div>
  );
}

export default TurnList;

function getTurnList(
  currentLobbyPlayerId: string,
  opponentName: string,
  previousTurns: Turn[],
): JSX.Element {

  const turnsHtml: JSX.Element[] = map(previousTurns, (turn: Turn, i) => {
    const key: string = 'turnlist-turn-' + i;
    const lobbyPlayerId: string = getLobbyPlayerIdWhoPlayedTurn(turn);
    const action: Action = getActionFromTurn(turn);

    return (
      <div className="turn-row" key={key}>
        {getListItemFromAction(
          previousTurns.length - i,
          lobbyPlayerId !== currentLobbyPlayerId,
          opponentName,
          action,
        )}
      </div>
    );
  });

  return (
    <div className="list">
      {turnsHtml}
    </div>
  );
}

function getLobbyPlayerIdWhoPlayedTurn(turn: Turn): string {
  let lobbyPlayerId: string | undefined;

  each(turn.playerTurns, (action, _lobbyPlayerId: string) => {
    lobbyPlayerId = _lobbyPlayerId;
  });

  if (!lobbyPlayerId) throw new Error('missing action from turn' + JSON.stringify(turn));

  return lobbyPlayerId;
}

function getActionFromTurn(turn: Turn): Action {
  let action: Action | undefined;

  each(turn.playerTurns, (_action) => {
    action = _action;
  });

  if (!action) throw new Error('missing action from turn' + JSON.stringify(turn));

  return action;
}

function getListItemFromAction(
  turnNumber: number,
  isOpponentsTurn: boolean,
  opponentName: string,
  action: Action,
): JSX.Element {
  let subject: string;

  if (action.type === PLACE_SHIPS_MULE_ACTION) {
    subject = isOpponentsTurn ? opponentName + '\'s' : 'Your';
    return (
      <div>
        {turnNumber}. <span className="subject">{subject}</span> ship placement phase
      </div>
    );
  }

  const fireShotMeta: FireShotMuleActionMetaData = action.metadata as any as FireShotMuleActionMetaData;
  subject = isOpponentsTurn ? opponentName : 'You';
  const andString: string = ' and ' + (fireShotMeta.newShot.hit ? 'hit a ship' : 'missed');

  return (
    <div>
      {turnNumber}. <span className="subject">{subject}</span> shot at <span className="coord">{getBattleshipCoordString(fireShotMeta.newShot.coord)}</span> {andString}
    </div>
  );
}
