const express = require('express');
const bearerToken = require('express-bearer-token');

const app = express();

app.use(bearerToken());

app.get('/hello', (req, res) => {
  res.send(`Hello World: ${req.token}`);
});

let server = null;

function start() {
  const port = 0;

  server = app.listen(port, () => {
      console.log(`Server listening on port ${server.address().port}`);
      app.emit('ready', null);
    });
    exports.server = server;
  }

/* eslint no-process-env: "off" */
if (process.env.NODE_ENV === 'test') {
  exports.start = start;
  exports.app = app;
} else {
  start();
}
