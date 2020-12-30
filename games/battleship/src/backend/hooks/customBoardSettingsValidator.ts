
import { CustomBoardSettingsValidatorHook, VariableMap } from 'mule-sdk-js';

const customBoardSettingsValidator: CustomBoardSettingsValidatorHook = (customBoardSettings: VariableMap) => {
  const invalidSettings = {};

  return invalidSettings;
};

export default customBoardSettingsValidator;
