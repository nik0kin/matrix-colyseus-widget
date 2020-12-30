import { connect, Dispatch } from 'react-redux';

import TurnList from '../components/TurnList';
import { StoreState } from '../types/index';

export function mapStateToProps({gameState}: StoreState) {
  return {
    currentLobbyPlayerId: gameState.yourLobbyPlayerId,
    opponentName: gameState.mule.players[gameState.theirLobbyPlayerId].name,
    previousTurns: gameState.mule.previousTurns,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<StoreState>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TurnList);
