/* eslint no-process-env: "off" */
/* global describe, it */

process.env.NODE_ENV = 'test';

const jwksVerify = require('../');
const {expect} = require('chai');
const errors = require('../lib/errors');

// eslint-disable-next-line max-statements
describe('OPTIONS', () => {
  it('check options === undefined', () => {
    expect(() => {
      jwksVerify();
    }).to.throw(errors.WrongArguments, 'argument options is required');
  });
  it('check typeof options !== object', () => {
    expect(() => {
      jwksVerify('text');
    }).to.throw(errors.WrongArguments, 'argument options must be an object');
  });
  it('check options === null', () => {
    try {
      jwksVerify(null);
    } catch (err) {
      expect(err.name).to.equal('WrongArguments');
      expect(err.message).to.equal('argument options is required');
    }
  });
  it('check options.jwks === undefined', () => {
    expect(() => {
      jwksVerify({prop: true});
    }).to.throw(errors.WrongArguments, 'argument options.jwks is required');
  });
  it('check options.jwks invalid url', () => {
    expect(() => {
      jwksVerify({jwks: 'uri'});
    }).to.throw(errors.InvalidUrl, 'uri is not a valid URL');
  });
  it('check options.jwks === http://127.0.0.1:4000/auth/.well-known.json', () => {
    expect(() => {
      jwksVerify({jwks: 'http://127.0.0.1:4000/auth/.well-known.json'});
    }).to.not.throw();
  });
  it('check typeof options.memberToken not string or function', () => {
    expect(() => {
      jwksVerify({
        jwks: 'http://127.0.0.1:4000/auth/.well-known.json',
        memberToken: {}
      });
    }).to.throw(errors.WrongArguments, 'options.memberToken must be a string or function');
  });
  it('check typeof options.memberToken === string', () => {
    expect(() => {
      jwksVerify({
        jwks: 'http://127.0.0.1:4000/auth/.well-known.json',
        memberToken: 'JWT'
      });
    }).to.not.throw();
  });
  it('check typeof options.memberToken === function', () => {
      expect(() => {
        jwksVerify({
          jwks: 'http://127.0.0.1:4000/auth/.well-known.json',
          memberToken: (req) => req.token
        });
      }).to.not.throw();
  });
  it('check typeof options.memberDecoded !== string', () => {
    expect(() => {
      jwksVerify({
        jwks: 'http://127.0.0.1:4000/auth/.well-known.json',
        memberDecoded: {}
      });
    }).to.throw(errors.WrongArguments, 'options.memberDecoded must be a string or default');
  });
  it('check typeof options.memberDecoded === string', () => {
    expect(() => {
      jwksVerify({
        jwks: 'http://127.0.0.1:4000/auth/.well-known.json',
        memberDecoded: 'decoded'
      });
    }).to.not.throw();
  });
});
