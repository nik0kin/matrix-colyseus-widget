// // import { Action, MulePlayTurnRequest, MulePlayTurnResponse, SDK } from 'mule-sdk-js';

// import { getGameId, getLobbyPlayerId, getSdk } from './data';

// export async function submitMuleTurn(actions: Action[]): Promise<MulePlayTurnResponse> {
//   const muleSdk: SDK = getSdk();
//   const params: MulePlayTurnRequest = {
//     playerId: getLobbyPlayerId(),
//     actions
//   };

//   return muleSdk.PlayTurn.sendGameTurnQ(getGameId(), params)
//     .then((response: MulePlayTurnResponse) => {
//       if (response.msg !== 'Success') {
//         throw new Error('' + JSON.stringify(response));
//       }
//       return response;
//     });
// }
