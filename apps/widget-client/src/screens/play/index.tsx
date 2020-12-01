import React, { FC } from 'react';

import { useSetRoute } from '../../contexts';

import './style.css';

export const PlayScreen: FC = () => {
  const setRoute = useSetRoute();

  return (
    <div className="PlayScreen">
      <nav>
        <button onClick={() => setRoute('lobby')}>Back</button>
      </nav>
      <iframe title="Game" src="/games/tictactoe"></iframe>
    </div>
  )
};
