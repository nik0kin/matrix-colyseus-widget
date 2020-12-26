import { Client } from 'colyseus.js';

// eslint-disable-next-line no-restricted-globals
export const client = new Client(`${location.protocol.includes('https') ? 'wss' : 'ws'}://${location.hostname}:2567`);
