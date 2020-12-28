
define(['connectRenderer'], function (connectRenderer) {
  var that = {};

  var Current,
    customBoardSettings,
    submitTurnCallback,
    myPlayerRel,
    opponentPlayerRel;

  var board;

  that.init = function (_submitTurnCallback, current) {
    submitTurnCallback = _submitTurnCallback;
    Current = current;
  };

  that.initBoard = function (gameState, _customBoardSettings, _myPlayerRel, p1PlayerId) {
    myPlayerRel = _myPlayerRel;
    opponentPlayerRel = myPlayerRel === 'p1' ? 'p2' : 'p1';
    customBoardSettings = _customBoardSettings;
    connectRenderer.init(clickTopSpace, customBoardSettings);

    board = [];
    _.times(customBoardSettings.width, function () {
      var row = [];
      _.times(customBoardSettings.height, function () {
        row.push({});
      });
      board.push(row);
    });

    _.each(gameState.pieces, function (piece) {
      board[piece.x - 1][piece.y - 1].occupied = piece.ownerId === p1PlayerId ? 'p1' : 'p2';
    });

    connectRenderer.placeExistingPieces(board);

    if (myPlayerRel === Current.whosTurn) {
      showClickableColumns();
    }
  };

  that.receiveOpponentTurn = function (loc) {
    connectRenderer.dropPiece(loc.x, loc.y, opponentPlayerRel);
    board[loc.x - 1][loc.y - 1].occupied = opponentPlayerRel;

    showClickableColumns();
  };

  var showClickableColumns = function () {
    if (Current.isGameOver) {
      return;
    }

    var availableSpaces = [];
    var i;
    for (i = 0; i < customBoardSettings.width; i++) {
      if (!board[i][0].occupied) {
        availableSpaces.push({ x: i + 1, y: getLowestYInColumn(i + 1) });
      }
    }
    connectRenderer.readyForDrop(availableSpaces);
  };

  var clickTopSpace = function (x, y) {
    return function () {
      if (myPlayerRel != Current.whosTurn || Current.isGameOver) {
        return;
      }
      tryToDrop(x);
    };
  };

  var getLowestYInColumn = function (x) {
    var y = 1;
    if (board[x - 1][y - 1].occupied) {
      return 0;
    }

    // determine final location
    while (y + 1 <= customBoardSettings.height && !board[x - 1][y].occupied) {
      y++;
    }

    return y;
  };

  var tryToDrop = function (x) {
    var y = getLowestYInColumn(x);
    console.log('dropped to ' + x + '_' + y);

    board[x - 1][y - 1].occupied = myPlayerRel;
    connectRenderer.dropPiece(x, y, myPlayerRel);
    connectRenderer.stopReady();
    submitTurnCallback(x);
  };

  return that;
});
