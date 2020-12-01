import React, { FC } from 'react';

import { Spot } from './spot';

import './style.css';

export const Playfield: FC = () => {
  return (
    <div className="Playfield">
      <div className="container">
        <div className="inner">
          <Spot x={0} y={0} />
          <Spot x={1} y={0} />
          <Spot x={2} y={0} />
          <Spot x={0} y={1} />
          <Spot x={1} y={1} />
          <Spot x={2} y={1} />
          <Spot x={0} y={2} />
          <Spot x={1} y={2} />
          <Spot x={2} y={2} />
        </div>
      </div>
    </div>
  );
};
