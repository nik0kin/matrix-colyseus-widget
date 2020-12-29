
define(['connectX', 'colyseus-shim'],
  function (connectX, sdk) {
    let sessionId,
      sendMessage,
      userPlayerRel,
      opponentRel;

    const current = {
      whosTurn: undefined,
      isGameOver: false
    };

    const onGameStatusUpdate = () => { };
    const onInitialState = (spaces, pieces, p1Player, isPlayersTurn, customOptions) => {
      userPlayerRel = sessionId === p1Player ? 'p1' : 'p2';
      opponentRel = sessionId !== p1Player ? 'p1' : 'p2';

      current.whosTurn = isPlayersTurn ? userPlayerRel : opponentRel;

      populatePlayersLabel();
      populateTurnStatusLabel();

      connectX.initBoard({ spaces, pieces }, customOptions, userPlayerRel, p1Player);
    };
    const onSpotsUpdate = () => { };
    const onTokensUpdate = (isPlayersTurn, lastTokenDropped) => {
      if (isPlayersTurn && lastTokenDropped) {
        connectX.receiveOpponentTurn(lastTokenDropped);
      }
    };
    const onIsPlayersTurnUpdate = (isPlayersTurn) => {
      current.whosTurn = isPlayersTurn ? userPlayerRel : opponentRel;
      populatePlayersLabel();
      populateTurnStatusLabel();
    };
    const onWinnerUpdate = (winner) => {
      if (winner) {
        if (winner === 'tie') {
          populateWinConditionLabel(false, true);
        } else if (winner === sessionId) {
          populateWinConditionLabel(true);
        } else {
          populateWinConditionLabel(false);
        }
        current.isGameOver = true;
      }
    };

    const initGame = function () {
      sdk.initConnection(onGameStatusUpdate, onInitialState, onSpotsUpdate, onTokensUpdate, onIsPlayersTurnUpdate, onWinnerUpdate)
        .then(([roomId, _sessionId, _sendMessage]) => {
          // setIsConnected(true);
          $('#roomId').html('RoomId: ' + roomId);
          sessionId = _sessionId;
          $('#sessionId').html('SessionId: ' + sessionId);
          sendMessage = _sendMessage;
        });
    };

    const submitTurn = function (whereX) {
      sendMessage('DROP_TOKEN', {
        xDropLocation: whereX
      });
    };

    const populatePlayersLabel = function () {
      // TODO-fork support matrix names
      // const p1Name = playerMap['p1'].name;
      // const p2Name = playerMap['p2'].name;
      let p1Name = 'p1';
      let p2Name = 'p2';

      if (userPlayerRel === 'p1') {
        p1Name = '<b>' + p1Name + '</b>';
      } else if (userPlayerRel === 'p2') {
        p2Name = '<b>' + p2Name + '</b>';
      }

      $('#playersLabel').html(p1Name + ' vs ' + p2Name);
    };

    const populateTurnStatusLabel = function () {
      const yourOrTheir = (current.whosTurn === userPlayerRel) ? 'Your' : 'Their';

      $('#turnStatusLabel').html(yourOrTheir + ' Turn');
    };


    const populateWinConditionLabel = function (didWin, didTie) {
      if (didTie) {
        $('#winConditionLabel').html('<b>TIE</b>');
        return;
      }
      if (didWin) {
        $('#winConditionLabel').html('<b>WINNER</b>');
      } else {
        $('#winConditionLabel').html('<b>LOSER</b>');
      }
    };

    connectX.init(submitTurn, current);
    initGame();
  });

// TODO-fork missing "start game" transition if game is opened before gamestatus changes to in-progress
//   - fixable by reloading (back->play) but thats not great UX

// TODO-fork player always is red?
