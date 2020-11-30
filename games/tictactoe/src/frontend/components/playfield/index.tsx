import React, { FC } from 'react';

import { Spot } from './spot';

import './style.css';

export const Playfield: FC = () => {
  return (
    <div className="Playfield">
      <div className="container">
        <div className="inner">
          <Spot />
          <Spot />
          <Spot />
          <Spot />
          <Spot />
          <Spot />
          <Spot />
          <Spot />
          <Spot />
        </div>
      </div>
    </div>
  );
};
