jws-express
=========
![build status](https://gitlab.com/jorge.suit/jws-express/badges/master/build.svg)

This is a node package implementing an express middleware. The purpose
of the middleware is to parse and verify a JWS token provided in the
`req` object. You have to use another middleware to extract the raw
token from the request, for
instance
[express-bearer-token](https://www.npmjs.com/package/express-bearer-token)

The implementation is based on the node
package [node-jose](https://www.npmjs.com/package/node-jose) to verify
the JWS token. The client must provide the public key or keystore to
verify the signature of the token.

Right know the package only implement the verification of the token
based on the JWK store provided by an url (.well-known endpoint), but
we expect to provided other ways to verify the signed. The roadmap is
to support the public key in this order:

1. import JWKS from json object
1. import single key, either json or PEM file
1. use a secret????

Stay on top of
the [jws-express](https://gitlab.com/jorge.suit/jws-express) to know
the advances in the implementation.

Inside the directory test/fixture you can see and example of service
using the middleware. In the mean time we are going to complete the
documentation with all the options implemented.

# Installation

`npm install jws-express`

# Tests

`npm run lint`

`npm test`

At the end of the test you can see the coverage report.

# Usage

```javascript
const express = require('express');
const bearerToken = require('express-bearer-token');
const jwsExpress = require('jws-express');

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
```

# Contributing

In lieu of a formal style guide, take care to maintain the existing
coding style. Add unit tests for any new or changed
functionality. Lint and test your code.
