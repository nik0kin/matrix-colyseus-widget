import http from 'http';
import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { Server, LobbyRoom } from 'colyseus';
import { monitor } from '@colyseus/monitor';
// import socialRoutes from '@colyseus/social/express'

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

// register your room handlers

mcwConfig.gamesSupported.forEach((gameConfig) => {
  const backendConfig: BackendGameConfig = require(resolve('../', gameConfig.backendModule)).default;
  gameServer.define(backendConfig.name, backendConfig.GameRoom as any)
    .enableRealtimeListing();

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
