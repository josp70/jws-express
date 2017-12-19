const express = require('express');
const bearerToken = require('express-bearer-token');
const jwsExpress = require('../../index');

function start(jwks) {
  const port = 0;
  const app = express();

  app.use(bearerToken());
  app.use(jwsExpress({
    jwks: jwks || process.env.JWKS_ENDPOINT,
    memberDecoded: 'jwsDecoded'
  }));

  app.get('/hello', (req, res) => {
    res.json({
      JWS: req.token,
      jwsDecoded: req.jwsDecoded
    });
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${server.address().port}`);
      resolve(server);
    });
  });
}

/* eslint no-process-env: "off" */
if (process.env.NODE_ENV === 'test') {
  exports.start = start;
} else {
  start();
}
