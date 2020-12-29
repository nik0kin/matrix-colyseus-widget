import React, { FC, useRef } from 'react';

import { FeGameConfig } from 'common';

import { useSetRoute } from '../../contexts';

import './style.css';

export const PlayScreen: FC<{ gameConfig: FeGameConfig, room?: { id: string, sessionId: string; } | null }> = ({ gameConfig, room }) => {
  const setRoute = useSetRoute();
  const ref = useRef<HTMLIFrameElement | null>(null);

  const src = !gameConfig.colyseus || !room ?
    gameConfig.frontend :
    gameConfig.frontend + `?s=${room.sessionId}&r=${room.id}`;

  // Focus iframe onLoad so that it recieves keyboard events
  const focusIframe = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div className="PlayScreen">
      <nav>
        <button className="backBtn" onClick={() => setRoute('lobby')}>Back</button>
      </nav>
      <iframe title="Game" src={src} ref={ref} onLoad={focusIframe}></iframe>
    </div>
  )
};
