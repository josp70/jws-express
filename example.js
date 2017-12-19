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

app.listen(4000);
