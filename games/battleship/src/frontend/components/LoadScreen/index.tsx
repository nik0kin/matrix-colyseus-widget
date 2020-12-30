import { includes } from 'lodash';
import * as React from 'react';

import './style.css';
import Layout from '../../containers/Layout';

export interface Props {
  isGameStateLoaded: boolean;
  loadError?: Error;
}

const messagesToShow: string[] = [
  'game has not started',
  'user has no session',
  'user is not in game',
];

export function LoadScreen({ loadError, isGameStateLoaded }: Props) {
  if (isGameStateLoaded) {
    return (
      <Layout/>
    );
  }

  return (
    <div className="LoadScreen">
      {getLoadingMessage(loadError)}
    </div>
  );
}

function getLoadingMessage(loadError?: Error): string {
  if (loadError) {
    if (loadError instanceof Error && includes(messagesToShow, loadError.message)) {
      return loadError.message;
    } else {
      setTimeout(
        () => {
          throw loadError;
        },
        0
      );
      return 'Something else went wrong... check console';
    }
  } else {
    return 'Loading';
  }
}
