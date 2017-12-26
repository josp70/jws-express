const errors = require('./lib/errors');
const validator = require('validator');
const ms = require('ms');
const request = require('request-promise-native');
const jose = require('node-jose');
const get = require('lodash.get');
const set = require('lodash.set');

let jwksCache = null;
let verifyCache = null;
let timeBuildCache = null;

function initCache() {
  jwksCache = null;
  verifyCache = null;
  timeBuildCache = null;
}

const HTTP401 = 401;

const config = {
  memberToken: 'token',
  memberDecoded: 'jwsDecoded',
  cacheMaxAge: ms('1d')
};

function rebuildCache() {
  return request({
    uri: config.urlJWKS,
    json: true
  })
  .then(jose.JWK.asKeyStore)
  .then((keyStore) => {
    jwksCache = keyStore;
    verifyCache = jose.JWS.createVerify(jwksCache);
  })
  .catch((reason) => {
    if (reason.name === 'StatusCodeError') {
      return Promise.reject(new errors.BadRequest('error requesting JWKS endpoint', {
        uri: reason.options.uri,
        statusCode: 404
      }));
    }
    // forward other reasons
    return Promise
    .reject(new errors.InvalidKeyStore(`${reason.name}: ${reason.message}`, {
      uri: config.urlJWKS
    }));
  });
}

function refreshCacheIfNeeded() {
  const now = Date.now();

  if (timeBuildCache === null) {
    timeBuildCache = now - config.cacheMaxAge - 1;
  }
  const elapsed = now - timeBuildCache;

  if (elapsed >= config.cacheMaxAge) {
    return rebuildCache().then(() => {
      timeBuildCache = Date.now();
      return timeBuildCache;
    });
  }
  return Promise.resolve(timeBuildCache);
}

function getJWKSFromUrl() {
  return refreshCacheIfNeeded().then(() => jwksCache);
}

function getTokenFromRequest(req) {
  return get(req, config.memberToken);
}

// eslint-disable-next-line max-statements
function processOptions(options) {
  if (options === null || typeof options === 'undefined') {
    throw new errors.WrongArguments('argument options is required');
  }
  if (typeof options !== 'object') {
    throw new errors.WrongArguments('argument options must be an object');
  }
  if (typeof options.jwks === 'undefined') {
    throw new errors.WrongArguments('argument options.jwks is required');
  }
  if (validator.isURL(options.jwks)) {
    config.urlJWKS = options.jwks;
    config.getJWKS = getJWKSFromUrl;
  } else {
    throw new errors.InvalidUrl(`${options.jwks} is not a valid URL`);
  }

  // eslint-disable-next-line array-element-newline
  if (['undefined', 'string'].includes(typeof options.memberToken)) {
    config.getToken = getTokenFromRequest;
  } else if (typeof options.memberToken === 'function') {
    config.getToken = options.memberToken;
  } else {
    throw new errors.WrongArguments('options.memberToken must be a string or function');
  }
  // eslint-disable-next-line array-element-newline
  if (!['undefined', 'string'].includes(typeof options.memberDecoded)) {
    throw new errors.WrongArguments('argument options.memberDecoded must be a string or default');
  }
  if (typeof options.memberDecoded === 'string') {
    config.memberDecoded = options.memberDecoded;
  }
}

module.exports = (options) => {
  initCache();
  processOptions(options);
  return (req, res, next) => {
    config.getJWKS()
    .then(() => {
      const token = config.getToken(req);

      if (typeof token === 'string') {
        return verifyCache.verify(token)
        .then((result) => {
          set(req, config.memberDecoded, {
            protected: result.protected,
            header: result.header,
            payload: JSON.parse(result.payload.toString())
          });
          next();
        });
      }
      return res.status(HTTP401).json({
        name: 'InvalidToken',
        message: 'token must be a string'
      });
    })
    .catch((reason) => {
      res.status(HTTP401).json({
        name: reason.name,
        message: reason.message,
        data: reason.data
      });
    });
  };
};
