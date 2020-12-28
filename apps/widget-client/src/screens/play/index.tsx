import React, { FC, useRef } from 'react';

import { FeGameConfig } from 'common';

import { useSetRoute } from '../../contexts';

import './style.css';

export const PlayScreen: FC<{ gameConfig: FeGameConfig }> = ({ gameConfig }) => {
  const setRoute = useSetRoute();
  const ref = useRef<HTMLIFrameElement | null>(null);

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
      <iframe title="Game" src={gameConfig.frontend} ref={ref} onLoad={focusIframe}></iframe>
    </div>
  )
};
