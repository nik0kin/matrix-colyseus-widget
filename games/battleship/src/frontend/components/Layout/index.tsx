import * as React from 'react';
// import * as _ from 'lodash';

import Playfield from '../../containers/Playfield';
import ShipList from '../../containers/ShipList';
import TurnList from '../../containers/TurnList';
import { GameState, PlayerMap } from '../../types';
import {
  Coord, getBattleshipCoordString, getPlaceShipsActionParamsFromMuleAction, getTotalShipsPerPlayer,
  isValidFireShotCoord, Shot, Action,
} from '../../../shared';

import { WaitingIndicator } from './waiting-indicator';

import './style.css';

type ClickSubmitFn = (pendingTurn: { actions: Action[] }) => void;

export interface Props {
  isYourTurn: boolean;
  selectedCoord?: Coord;
  players: PlayerMap;
  gameState: GameState;
  pendingActions: Action[];
  clickSubmit: ClickSubmitFn;
  isSubmitting: boolean;
}

function Layout({ isYourTurn, selectedCoord, gameState, players, pendingActions, clickSubmit, isSubmitting }: Props) {
  const theirName: string = gameState.mule.players[gameState.theirLobbyPlayerId].name;

  const shipsLeftToBePlaced: number = getAmountOfShipsRemainingToPlace(gameState.isPlacementMode, pendingActions);

  return (
    <div>
      <h1> mcwBattleship </h1>
      <div className="container">
        <div className="gameinfo">

          <div className="current-turn-info">
            <div> Turn {gameState.mule.currentTurn} </div>
            {false && !isYourTurn && <WaitingIndicator />}
            <div className="short-description">
              {getShortDescription(
                isYourTurn,
                gameState.isPlacementMode,
                gameState.isGameOver,
                gameState.yourLobbyPlayerId === gameState.mule.winner,
              )}
            </div>
          </div>
          <button
            className="submit-button"
            onClick={() => clickSubmit({ actions: pendingActions })}
            disabled={
              isSubmitting || !isYourTurn || gameState.isGameOver
              || isSubmitButtonDisabled(
                gameState.isPlacementMode,
                shipsLeftToBePlaced,
                selectedCoord,
                gameState.yourShots,
              )
            }
          >
            {getSubmitButtonText(
              isYourTurn,
              theirName,
              gameState.isPlacementMode,
              gameState.isOpponentPlacementMode,
              gameState.isGameOver,
              shipsLeftToBePlaced,
              selectedCoord,
            )}
          </button>

          <ShipList />

          <TurnList />

          <div className="shot-list" />
        </div>
        <div className="gameboard">
          <Playfield />
        </div>
      </div>
      <div className="chat" />
    </div>
  );
}

export default Layout;

function isSubmitButtonDisabled(
  isPlacementMode: boolean,
  shipsLeftToBePlaced: number,
  selectedCoord: Coord | undefined,
  previousShots: Shot[]
): boolean {
  if (isPlacementMode) {
    return shipsLeftToBePlaced !== 0;
  } else {
    // FireShot mode
    const enabled: boolean = isValidFireShotCoord(selectedCoord, previousShots);
    return !enabled;
  }
}

function getSubmitButtonText(
  isYourTurn: boolean,
  opponentName: string,
  isPlacementMode: boolean,
  isOpponentPlacementMode: boolean,
  isGameOver: boolean,
  shipsLeftToBePlaced: number,
  selectedCoord?: Coord
): string {

  if (isGameOver) return 'Game Over';

  if (!isYourTurn) {
    if (isOpponentPlacementMode) {
      return `Waiting on ${opponentName}'s Ship Placement`;
    } else {
      return `Waiting on ${opponentName} to Fire a Shot`;
    }
  }

  if (shipsLeftToBePlaced) {
    if (shipsLeftToBePlaced === 1) {
      return 'Place last ship';
    }
    return `Place ${shipsLeftToBePlaced} remaining ships`;
  } else if (isPlacementMode) {
    return 'Submit Turn';
  }

  if (selectedCoord) {
    return 'Fire at ' + getBattleshipCoordString(selectedCoord);
  }

  // TODO different message if its the other players turn

  return 'Select Fire Location';
}

function getAmountOfShipsRemainingToPlace(isPlacementMode: boolean, pendingActions: Action[]): number {
  if (isPlacementMode) {
    const pendingPlacements: number = getPlaceShipsActionParamsFromMuleAction(pendingActions[0]).shipPlacements.length;
    return getTotalShipsPerPlayer() - pendingPlacements;
  } else {
    return 0;
  }
}

function getShortDescription(
  isYourTurn: boolean,
  isPlacementMode: boolean,
  isGameOver: boolean,
  isPlayerWinner: boolean,
): string {
  if (isGameOver) {
    return isPlayerWinner ? 'You Won' : 'You Lost';
  } else if (isPlacementMode) {
    if (isYourTurn) {
      return 'Your Placement';
    } else {
      return 'Opponent Placement';
    }
  } else {
    if (isYourTurn) {
      return 'Your Shot';
    } else {
      return 'Opponent Shot';
    }
  }
}
