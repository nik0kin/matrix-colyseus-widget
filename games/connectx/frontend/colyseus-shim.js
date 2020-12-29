
define(function () {
  const client = new Colyseus.Client(`${location.protocol.includes('https') ? 'wss' : 'ws'}://${location.hostname || 'localhost'}:2567`);

  const setReconnectData = (room) => {
    sessionStorage.setItem('lastRoomId', room.id);
    sessionStorage.setItem('lastSessionId', room.sessionId);
  };

  const getRoom = async () => {
    const urlParams = new URLSearchParams(location.search);

    const lastRoomId = urlParams.get('r') || sessionStorage.getItem('lastRoomId');
    const lastSessionId = urlParams.get('s') || sessionStorage.getItem('lastSessionId');

    // Attempt reconnect
    if (lastRoomId && lastSessionId) {
      try {
        const room = await client.reconnect(lastRoomId, lastSessionId);
        setReconnectData(room);
        return room;
      } catch (e) {
        // ignore
      }
    }

    const room = await client.joinOrCreate('connectx'); // matches id in mcw.config.js
    setReconnectData(room);
    return room;
  };

  const initConnection = async (
    onGameStatusUpdate,
    onInitialState,
    onSpotsUpdate,
    onTokensUpdate,
    onIsPlayersTurnUpdate,
    onWinnerUpdate,
  ) => {
    try {
      const room = await getRoom();

      let firstUpdate = true;

      room.onMessage('game-start', () => {
        onGameStatusUpdate(GameStatus.InProgress);
      });

      room.onStateChange.once((state) => {
        console.log("this is the first room state!", state);
        onInitialState(state.spots, state.tokens, state.p1Player, state.nextTurn === room.sessionId);
        onSpotsUpdate(state.spots);
        onGameStatusUpdate(state.status);
        onWinnerUpdate(state.winner);
        firstUpdate = false;
      });

      room.onStateChange((state) => {
        console.log("the room state has been updated:", state);

        if (!firstUpdate) {
          onTokensUpdate(state.nextTurn === room.sessionId, state.tokens[state.tokens.length - 1]);
        }
      });

      room.state.onChange = (changes) => {
        changes.forEach((change) => {
          if (change.field === 'spots') {
            onSpotsUpdate(change.value);
          }
          if (change.field === 'nextTurn' && !firstUpdate) {
            onIsPlayersTurnUpdate(change.value === room.sessionId);
          }
          if (change.field === 'status') {
            onGameStatusUpdate(change.value);
          }
          if (change.field === 'winner') {
            onWinnerUpdate(change.value);
          }
        });
      };

      return [
        room.id,
        room.sessionId,
        (type, payload) => {
          console.log(type, payload);
          room.send(type, payload);
        }
      ];
    } catch (e) {
      console.log('Could not join!');
      console.error(e);
      return Promise.reject('Fack');
    }
  }

  return {
    initConnection
  };
});
