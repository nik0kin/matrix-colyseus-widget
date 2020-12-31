import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import TurnList from '../components/TurnList';
import { StoreState } from '../types/index';

export function mapStateToProps({ gameState }: StoreState) {
  return {
    currentLobbyPlayerId: gameState.yourLobbyPlayerId,
    opponentName: gameState.mule.players[gameState.theirLobbyPlayerId].name,
    previousTurns: gameState.mule.previousTurns,
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TurnList);
