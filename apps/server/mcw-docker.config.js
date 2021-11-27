
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
      displayName: 'Farmsprawl (Singleplayer)',
      backendModule: '../games/project-farm/backend-dist',
      frontendFiles: '../games/project-farm/build',
      quickOptions: { width: 27, height: 60 }
    },
    {
      id: 'solitaire',
      displayName: 'Solitaire',
      frontendFiles: '../games/solitaire',
      attribution: {
        author: 'cyanharlow',
        license: '???',
        source: 'https://github.com/cyanharlow/solitaire'
      }
    },
    {
      id: 'sudoku',
      displayName: 'Sudoku',
      frontendFiles: '../games/sudoku-js',
      attribution: {
        author: 'baruchel',
        license: 'MIT',
        source: 'https://github.com/baruchel/sudoku-js'
      }
    },
    {
      id: 'puzzles',
      displayName: 'Puzzle Collection',
      frontendFiles: '../games/puzzles-menu',
      attribution: {
        author: 'Simon Tatham',
        license: 'MIT',
        source: 'https://git.tartarus.org/?p=simon/puzzles.git'
      }
    },
    {
      id: '2048',
      displayName: '2048',
      frontendFiles: '../games/2048',
      attribution: {
        author: 'gabrielecirulli',
        license: 'MIT',
        source: 'https://github.com/gabrielecirulli/2048'
      }
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
    },
    {
      id: 'oregon-trail',
      displayName: 'Oregon Trail',
      frontendIframe: 'https://warnock.github.io/oregon-trail-game/',
      attribution: {
        author: 'Gloria Friesen, Megan Warnock, Ryan McAlpin, Chris Carr, Riley Watts',
        license: 'MIT',
        source: 'https://github.com/warnock/oregon-trail-game'
      }
    }
  ]
};
