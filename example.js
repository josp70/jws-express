/* eslint no-process-env: "off" */

const express = require('express');
const bearerToken = require('express-bearer-token');
const jwsExpress = require('./');

const app = express();

app.use(bearerToken());
app.use(jwsExpress({
  jwks: process.env.JWKS_ENDPOINT,
  memberDecoded: 'jwsDecoded'
}));

app.get('/hello', (req, res) => {
  res.json({
    JWS: req.token,
    jwsDecoded: req.jwsDecoded
  });
});

const port = 4000;

app.listen(port);
