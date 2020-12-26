# matrix-colyseus-widget

WIP

## docker

Build container

`docker build -t niko/mcw .`

Run container to use without https

`docker run -p 2567:2567 -d niko/mcw`

Build container to run on 2560 so that it can be reverse proxied on 2567 with https

`docker run -p 2560:2567 -d niko/mcw`
