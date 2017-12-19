const express = require('express');
const jwksDb = require('jwks-db');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/make_jws', (req, res) => {
  jwksDb.generateJWS(req.body)
  .then((token) => {
    res.json({token});
  });
});

app.get('/.well-known/jwks.json', (req, res) => {
  res.json(jwksDb.get().toJSON());
});

function start() {
  const port = 0;

  return jwksDb.connect()
  .then(() => new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${server.address().port}`);
      resolve(server);
    });
  }));
}

/* eslint no-process-env: "off" */
if (process.env.NODE_ENV === 'test') {
  exports.start = start;
} else {
  start();
}
