import React, { FC } from 'react';

// import './style.css';

export const LobbyScreen: FC = () => {
  return (
    <div>
      <h1>Lobby</h1>
      <div>
        <button>Start new game</button>
      </div>
      <div>
        <h2>Joinable Games</h2>
        <ul>
          <li>
            Game 1 - TicTacToe - 1/2 <button>join</button>
          </li>
        </ul>
      </div>
      <div>
        <h2>Active Games</h2>
        <ul>
          <li>
            Game 2 - TicTacToe - 2/2 <button>play</button>
          </li>
        </ul>
      </div>
    </div>
  )
};
