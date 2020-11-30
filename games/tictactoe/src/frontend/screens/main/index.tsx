import React, { FC } from 'react';

import { Playfield } from '../../components';

// import './style.css';

export const MainScreen: FC = () => {
  return (
    <div>
      <h4>Connected</h4>
      <div>
        <Playfield />
      </div>
    </div>
  )
};
