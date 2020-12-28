
module.exports = {
  gamesSupported: [
    {
      id: 'tictactoe',
      displayName: 'TicTacToe',
      backendModule: '../games/tictactoe/backend-dist',
      frontendFiles: '../games/tictactoe/build'
    },
    {
      id: 'solitaire',
      displayName: 'Solitaire',
      frontendFiles: '../games/solitaire'
    },
    {
      id: 'sudoku',
      displayName: 'Sudoku',
      frontendFiles: '../games/sudoku-js'
    },
    {
      id: 'puzzles',
      displayName: 'Puzzle Collection',
      frontendFiles: '../games/puzzles-menu'
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
