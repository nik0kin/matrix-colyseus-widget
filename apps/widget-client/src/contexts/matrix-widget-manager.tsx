import { WidgetApi } from 'matrix-widget-api';
import React, { FC, Fragment, useState, useEffect, createContext, useContext } from 'react';

const DEBUG = window.location.protocol !== 'https:';

const MATRIX_AUTH_TIMEOUT = 30 * 1000;

interface MatrixWidgetContextType {
  enabled: boolean;
  matrixAuth: [string, string]; // [openIdAccessToken, matrixServerName]
}

const MatrixWidgetContext = createContext<MatrixWidgetContextType>(null as any);

export const MatrixWidgetManager: FC = ({ children }) => {

  const [api] = useState(() => new WidgetApi());
  const [matrixAuth, setMatrixAuth] = useState<MatrixWidgetContextType['matrixAuth']>(['', '']);
  const [error, setError] = useState(false);

  useTimeout(() => {
    if (!matrixAuth) {
      setError(true);
    }
  }, MATRIX_AUTH_TIMEOUT);

  useEffect(() => {
    if (DEBUG) {
      setMatrixAuth(['DEV_USER-token', 'matrix.fake']);
      return;
    }

    // Start the messaging
    api.start();

    api.on('ready', () => {
      console.log('widget api ready')

      api.requestOpenIDConnectToken()
        .then((response) => {
          console.log('Matrix OpenId request success: ', response);
          setMatrixAuth([response.access_token!, response.matrix_server_name!]);
        })
        .catch((error) => {
          console.error('Matrix OpenId request failed', error);
          setError(true);
        });
    });

    // return () => api.stop();
  }, [api]);

  if (!matrixAuth && !error) return <Fragment>Authenticating with Matrix</Fragment>;

  return <MatrixWidgetContext.Provider value={{ enabled: !error, matrixAuth }}>{children}</MatrixWidgetContext.Provider>;
};

export const useMatrixAuth = () => useContext(MatrixWidgetContext).matrixAuth;

// https://www.30secondsofcode.org/react/s/use-timeout
const useTimeout = (callback: () => void, delay: number) => {
  const savedCallback = React.useRef<() => void>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current!();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};
