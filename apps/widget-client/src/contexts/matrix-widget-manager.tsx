import { WidgetApi } from 'matrix-widget-api';
import React, { FC, Fragment, useState, useEffect, createContext, useContext } from 'react';

const DEBUG = window.location.protocol !== 'https:';

interface MatrixWidgetContextType {
  openIdAccessToken: string;
}

const MatrixWidgetContext = createContext<MatrixWidgetContextType>(null as any);

export const MatrixWidgetManager: FC = ({ children }) => {

  const [api] = useState(() => new WidgetApi());
  const [openIdAccessToken, setToken] = useState<string>('');

  useEffect(() => {
    if (DEBUG) {
      setToken('DEV_USER');
      return;
    }

    // Start the messaging
    api.start();

    api.on('ready', () => {
      console.log('widget api ready')

      api.requestOpenIDConnectToken()
        .then((response) => {
          console.log('Matrix OpenId request success: ', response);
          setToken(response.access_token!);
        })
        .catch((error) => {
          console.error('Matrix OpenId request failed', error);
        });
    });

    // return () => api.stop();
  }, [api]);

  if (!openIdAccessToken) return <Fragment>Authenticating with Matrix</Fragment>;

  return <MatrixWidgetContext.Provider value={{ openIdAccessToken }}>{children}</MatrixWidgetContext.Provider>;
};

export const useOpenIdAccessToken = () => useContext(MatrixWidgetContext).openIdAccessToken;
