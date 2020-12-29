
module.exports = {
  gamesSupported: [
    {
      id: 'connectx',
      displayName: 'ConnectX',
      backendModule: '../games/connectx/backend/dist',
      frontendFiles: '../games/connectx/frontend',
      quickSettings: { width: 7, height: 6, connectLength: 4 }
    },
    {
      id: 'tictactoe',
      displayName: 'TicTacToe',
      backendModule: '../games/tictactoe/backend-dist',
      frontendFiles: '../games/tictactoe/build',
      quickSettings: {}
    },
    {
      id: 'tetris',
      displayName: 'Tetris',
      frontendIframe: 'https://chvin.github.io/react-tetris/?lan=en'
    },
    {
      id: 'skifree',
      displayName: 'SkiFree',
      frontendIframe: 'https://basicallydan.github.io/skifree.js/',
      attribution: {
        creator: 'Dan Hough <daniel.hough@gmail.com>',
        license: 'MIT',
        source: 'https://github.com/basicallydan/skifree.js'
      }
    }
  ]
};
