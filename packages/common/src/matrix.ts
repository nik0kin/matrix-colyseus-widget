// import { Room } from 'colyseus';
import fetch from 'node-fetch';

const cache: Record<string, string> = {};

export async function authWithMatrix(GameRoomClass: any, matrixOpenIdAccessToken: string) {
  if ((GameRoomClass as any).DEBUG) return 'DEV_USER' + Date.now();

  if (!matrixOpenIdAccessToken) {
    console.error('onAuth attempt without matrixOpenIdAccessToken');
    return false;
  }

  if (cache[matrixOpenIdAccessToken]) {
    // Already been authed
    console.log('onAuth already authed: ', cache[matrixOpenIdAccessToken]);
    return cache[matrixOpenIdAccessToken];
  }

  try {
    const resp = await fetch('https://matrix.tgp.io' + '/_matrix/federation/v1/openid/userinfo' + '?access_token=' + matrixOpenIdAccessToken);
    const data = await resp.json();

    if (data.error || data.errcode) {
      throw data;
    }

    console.log('matrix lookup success', data);

    cache[matrixOpenIdAccessToken] = data.sub;

    console.log('onAuth authed: ', data.sub);
    return data.sub;
  } catch (e) {
    console.error('matrix lookup failed', e);
    return false;
  }
}