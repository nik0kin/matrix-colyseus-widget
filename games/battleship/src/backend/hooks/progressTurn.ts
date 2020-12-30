
import { MuleStateSdk, ProgressTurnHook } from 'mule-sdk-js';

const progressTurnHook: ProgressTurnHook = (M: MuleStateSdk) => {

  // This hook is not needed - all game logic happens in the single Action played per Turn

  return M.persistQ()
    .then(() => {
      return {}; // Round meta data
    });
};

export default progressTurnHook;
