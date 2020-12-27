import http from 'http';
import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { Server, LobbyRoom } from 'colyseus';
import { monitor } from '@colyseus/monitor';
// import socialRoutes from '@colyseus/social/express'

import { FeGameConfig } from 'common';

import { McwConfig, BackendGameConfig } from './config'

const mcwConfig: McwConfig = require('../mcw.config');

const port = Number(process.env.PORT || 2567);
const app = express()

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

gameServer.define('lobby', LobbyRoom);

const gamesSupported = mcwConfig.gamesSupported.map((gameConfig) => {
  const feGameConfig: FeGameConfig = {
    id: gameConfig.id,
    colyseus: !!gameConfig.backendModule,
    frontend: `/games/${gameConfig.id}`,
    displayName: gameConfig.displayName
  };
  return feGameConfig;
});

app.use('/config/games', (req, res) => {
  res.json({
    gamesSupported
  });
});

mcwConfig.gamesSupported.forEach((gameConfig) => {
  if (gameConfig.backendModule) {
    const backendConfig: BackendGameConfig = require(resolve('../', gameConfig.backendModule)).default;
    (backendConfig.GameRoom as any).gameId = gameConfig.id;
    gameServer.define(gameConfig.id, backendConfig.GameRoom as any)
      .enableRealtimeListing();
  }

  app.use(`/games/${gameConfig.id}`, express.static(resolve('../', gameConfig.frontendFiles)));
});


/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the import statement
 */
// app.use('/', socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor());

app.use('/widget', express.static('../widget-client/build'));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`)
