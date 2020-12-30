
via OpenID token

client calls widgetApi.requestOpenIDConnectToken(), then passes it with every request

onAuth hook
  - looks up if openId token is in cache
    - return username if it is
  - calls https://matrix.org/docs/spec/server_server/unstable#get-matrix-federation-v1-openid-userinfo
    - return username if token is valid
  - set metadata.players[].name & state.players[].name

https://github.com/matrix-org/matrix-doc/blob/master/proposals/1960-integrations-openid.md
