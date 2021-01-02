import { GameRoom } from './game-room';

const config = {
  GameRoom,
  joinableInProgress: true,
  customOptions: {
    width: {
      min: 10,
      max: 200
    },
    height: {
      min: 10,
      max: 200
    }
  }
};

export default config;
