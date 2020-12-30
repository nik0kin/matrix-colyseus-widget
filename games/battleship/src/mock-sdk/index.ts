import { MockSdk, SDK } from 'mule-sdk-js';

import { initMockData } from './data';

export * from 'mule-sdk-js';

export function initializeMuleSdk(contextPath: string): SDK {
  initMockData();
  return new MockSdk(contextPath);
}
