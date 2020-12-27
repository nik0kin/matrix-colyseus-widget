import React, { FC } from 'react';

import { useSetRoute } from '../../contexts';

import './style.css';

export const PlayScreen: FC<{ playGame: string }> = ({ playGame }) => {
  const setRoute = useSetRoute();
  const iframeSrc = playGame === 'solitaire' ? '/games/solitaire' : '/games/tictactoe';

  return (
    <div className="PlayScreen">
      <nav>
        <button onClick={() => setRoute('lobby')}>Back</button>
      </nav>
      <iframe title="Game" src={iframeSrc}></iframe>
    </div>
  )
};
