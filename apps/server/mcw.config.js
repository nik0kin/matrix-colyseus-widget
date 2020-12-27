
module.exports = {
  gamesSupported: [
    {
      id: 'tictactoe',
      displayName: 'TicTacToe',
      backendModule: '../games/tictactoe/backend-dist',
      frontendFiles: '../games/tictactoe/build'
    },
    {
      id: 'tetris',
      displayName: 'Tetris',
      frontendIframe: 'https://chvin.github.io/react-tetris/?lan=en'
    },
    {
      id: 'skifree',
      displayName: 'SkiFree',
      frontendIframe: 'http://basicallydan.github.io/skifree.js/'
    }
  ]
};
