
module.exports = {
  gamesSupported: [
    {
      id: 'connectx',
      displayName: 'ConnectX',
      backendModule: '../games/connectx/backend/dist',
      frontendFiles: '../games/connectx/frontend',
      quickOptions: { width: 7, height: 6, connectLength: 4 }
    },
    {
      id: 'tictactoe',
      displayName: 'TicTacToe',
      backendModule: '../games/tictactoe/backend-dist',
      frontendFiles: '../games/tictactoe/build',
      quickOptions: {}
    },
    {
      id: 'battleship',
      displayName: 'Battleship (Desktop)',
      backendModule: '../games/battleship/backend-dist',
      frontendFiles: '../games/battleship/build',
      quickOptions: {}
    },
    {
      id: 'project-farm',
      displayName: 'Farmsprawl',
      backendModule: '../games/project-farm/backend-dist',
      frontendFiles: '../games/project-farm/build',
      quickOptions: {}
    },
    {
      id: 'tetris',
      displayName: 'Tetris',
      frontendIframe: 'https://chvin.github.io/react-tetris/?lan=en',
      attribution: {
        author: 'Chvin',
        license: 'Apache-2.0',
        source: 'https://github.com/chvin/react-tetris'
      }
    },
    {
      id: 'skifree',
      displayName: 'SkiFree',
      frontendIframe: 'https://basicallydan.github.io/skifree.js/',
      attribution: {
        author: 'Dan Hough <daniel.hough@gmail.com>',
        license: 'MIT',
        source: 'https://github.com/basicallydan/skifree.js'
      }
    }
  ]
};
