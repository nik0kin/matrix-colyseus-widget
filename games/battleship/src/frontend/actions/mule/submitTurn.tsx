import { MulePlayTurnResponse } from 'mule-sdk-js';

import * as constants from '../../constants';

export interface SubmitTurnSuccess {
  type: constants.SUBMIT_TURN_SUCCESS;
  playTurnResponse: MulePlayTurnResponse;
}

export function submitTurnSuccess(playTurnResponse: MulePlayTurnResponse): SubmitTurnSuccess {
  return {
    type: constants.SUBMIT_TURN_SUCCESS,
    playTurnResponse,
  };
}

export interface SubmitTurnFailure {
  type: constants.SUBMIT_TURN_FAILURE;
  error: Error;
}

export function submitTurnFailure(error: Error): SubmitTurnFailure {
  return {
    type: constants.SUBMIT_TURN_FAILURE,
    error,
  };
}
