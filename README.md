jwks-verify-express
=========
![build status](https://gitlab.com/jorge.suit/jwks-verify-express/badges/master/build.svg)

This is a node package implementing an express middleware. The purpose of the
middleware is to parse and verify a JWS token provided in the `req` object. You have to use
another middleware to extract the raw token from the request, for instance
[express-bearer-token](https://www.npmjs.com/package/express-bearer-token)

The implementation is based on the node package [node-jose](https://www.npmjs.com/package/node-jose)
to verify the JWS token. The client must provide the public key or keystore to verify the signature
of the token.

Right know the package does not implement any functionality and for that reason it is at release `0.0.0`. The roadmap is to support the public key in this order:

1. import JWKS from `well-known` endpoint
1. import JWKS from json object
1. import single key

Stay on top of the [jwks-vrify-express](https://gitlab.com/jorge.suit/jwks-verify-express) to know the advances in the implementation