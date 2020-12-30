import { connect, Dispatch } from 'react-redux';

import * as actions from '../actions';
import { LoadScreen } from '../components/LoadScreen';
import { StoreState } from '../types';

export function mapStateToProps({ isGameStateLoaded, loadError }: StoreState) {

  return {
    isGameStateLoaded,
    loadError,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.RemovePendingAction>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadScreen);
