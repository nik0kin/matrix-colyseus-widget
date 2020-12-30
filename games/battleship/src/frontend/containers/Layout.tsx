import { connect, Dispatch } from 'react-redux';
import { Action } from 'mule-sdk-js';

import Layout from '../components/Layout';
import * as actions from '../actions/';
import { StoreState } from '../types/index';

export function mapStateToProps({gameState, ui: {selectedCoord}, pendingTurn, isSubmitting}: StoreState) {

  return {
    isYourTurn: gameState.mule.isYourTurn,
    players: gameState.mule.players,
    selectedCoord,
    gameState,
    pendingActions: pendingTurn.actions,
    isSubmitting,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.RemovePendingAction>) {
  return {
    clickSubmit: (pendingTurn: {actions: Action[]}) => dispatch(actions.clickSubmit(pendingTurn)),
    removePendingAction: (index: number) => dispatch(actions.removePendingAction(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
