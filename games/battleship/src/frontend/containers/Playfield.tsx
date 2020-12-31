import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Coord } from '../../shared';
import Playfield from '../components/Playfield';
import * as actions from '../actions/';
import { StoreState } from '../types';

export function mapStateToProps({ gameState, ui: { selectedCoord, selectedShipBeingPlaced }, pendingTurn }: StoreState) {
  return {
    gameState,
    selectedCoord,
    selectedShipBeingPlaced,
    pendingActions: pendingTurn.actions,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ClickSquare>) {
  return {
    clickSquare: (lobbyPlayerId: string, coord: Coord) => dispatch(actions.clickSquare(lobbyPlayerId, coord)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Playfield);
