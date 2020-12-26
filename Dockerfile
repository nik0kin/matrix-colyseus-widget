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
RUN (cd packages/utils && yarn build)
RUN (cd packages/common && yarn build)

RUN (cd games/tictactoe && yarn build && yarn build-backend)

RUN (cd apps/widget-client && yarn build)

EXPOSE 2567

WORKDIR 'apps/server'
CMD [ "yarn", "start" ]
