import { Room } from 'colyseus.js';
import React, { FC, useRef, useEffect, useState } from 'react';

import { useSetRoute, SlimRoom, useGetGameConfig } from '../../contexts';

import './style.css';

const displayNone = { 'display': 'none' };

// For some reason the first time we reconnect, we never get state events, so load up the app twice

export const PlayScreen: FC<{ gameId: string; room?: Room | SlimRoom | null }> = ({ gameId, room }) => {
  const setRoute = useSetRoute();
  const gameConfig = useGetGameConfig()(gameId)!;
  const ref1 = useRef<HTMLIFrameElement | null>(null);
  const ref2 = useRef<HTMLIFrameElement | null>(null);
  const [showGame1, setShowGame1] = useState(true);
  const [showGame2, setShowGame2] = useState(false);
  const [leftGame, setLeftGame] = useState(false);
  const [hideGame1, setHideGame1] = useState(true);

  const src = !gameConfig.colyseus || !room ?
    gameConfig.frontend :
    gameConfig.frontend + `?s=${room.sessionId}&r=${room.id}`;

  // Focus iframe onLoad so that it recieves keyboard events
  const focusIframe = (ref: any) => {
    if (ref.current) {
      if (leftGame) {
        setTimeout(() => {
          setShowGame1(false);
          setShowGame2(true);
        }, 2500); // TODO should send event from iframe1 once room is connected
      } else {
        ref.current.focus();
        setTimeout(() => ref.current && ref.current.focus(), 500); // why do i need to wait?
        setHideGame1(false);
      }
    }
  };

  useEffect(() => {
    if (room && (room as Room).leave && !(room as any).hasLeft) {
      (room as Room).leave(); // leave the room so that the iframe can reconnect
      (room as any).hasLeft = true; // TODO use room.connection.??

      setLeftGame(true);
    }
  }, [room]);

  return (
    <div className="PlayScreen">
      <nav>
        <button className="backBtn" onClick={() => setRoute('lobby')}>Back</button>
      </nav>
      {((hideGame1 && showGame1) || (hideGame1 && !showGame2)) && "Loading"}
      {showGame1 && <iframe key="1" title="Game" style={hideGame1 ? displayNone : {}} src={src} ref={ref1} onLoad={() => focusIframe(ref1)} />}
      {showGame2 && <iframe key="2" title="Game" src={src + '#second-try'} ref={ref2} onLoad={() => focusIframe(ref2)} />}
    </div>
  )
};
