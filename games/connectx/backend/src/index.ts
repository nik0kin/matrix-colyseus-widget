import { GameRoom } from './game-room';

const config = {
  GameRoom,
  customOptions: {
    connectLength: {
      min: 3,
      max: 13
    },
    width: {
      min: 3,
      max: 13
    },
    height: {
      min: 3,
      max: 13
    }
  }
};

export default config;
