# matrix-colyseus-widget

WIP

## docker

Build container

`docker build -t nik0kin/mcw .`

Run container to use without https

`docker run -p 2567:2560 -d nik0kin/mcw`

Build container to run on 2560 so that it can be reverse proxied on 2567 with https

`docker run -p 2560:2560 -d nik0kin/mcw`
