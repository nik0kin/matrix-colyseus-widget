FROM node:12

# Create root directory
WORKDIR /usr/src/widget-root

# Bundle sources
COPY apps apps
COPY games games
COPY packages packages

# Install npm dependencies
COPY package.json ./
COPY yarn.lock ./
COPY lerna.json ./

RUN yarn install

# Build packages, games, & widget
RUN yarn build-packages

RUN (cd games/tictactoe && yarn build && yarn build-backend)
RUN (cd games && git clone https://github.com/cyanharlow/solitaire)
RUN (cd games && git clone https://github.com/baruchel/sudoku-js && mv sudoku-js/sudoku.html sudoku-js/index.html)
RUN (cd games && git clone https://github.com/nik0kin/puzzles-menu)

RUN (cd apps/widget-client && yarn build)

RUN (cd apps/server && mv mcw-docker.config.js mcw.config.js)

ENV PORT 2560

EXPOSE 2560

WORKDIR 'apps/server'

CMD [ "yarn", "start" ]
