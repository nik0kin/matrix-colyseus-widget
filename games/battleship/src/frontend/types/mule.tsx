
export interface Player {
  playerId: string; // mule server player id
  playerRel: string; // this game of battleship player id (aka mule playerRel)
  name: string;
}

export interface PlayerMap {
  [playerRel: string]: Player;
}
