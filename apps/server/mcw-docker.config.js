
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
    }
  ]
};
