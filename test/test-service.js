/* eslint no-process-env: "off" */
/* global describe, it, after, before */

process.env.NODE_ENV = 'test';

const chakram = require('chakram');
const {expect} = chakram;

const jwsProvider = require('./fixture/jws-provider');
const service = require('./fixture/service');
const jwsExpress = require('../');

const HTTP200 = 200;
const HTTP401 = 401;

describe('JWS-EXPRESS', () => {
  const services = {};
  const payload = {
    admin: false,
    sub: 'user@email.com'
  };
  let jwsToken = '';

  const url = (srv) => services[srv].url;

  before('start server', (done) => {
    jwsProvider.start()
    .then((serverJWS) => {
      services.jws = {
        server: serverJWS,
        url: `http://127.0.0.1:${serverJWS.address().port}`
      };
      return service.start(`${services.jws.url}/.well-known/jwks.json`);
    })
    .then((serverMain) => {
      services.main = {
        server: serverMain,
        url: `http://127.0.0.1:${serverMain.address().port}`
      };
      done();
    });
  });

  describe('JWS Provider: Auxiliar Service', () => {
    it('return 200 & a JWS', () => {
      const response = chakram.post(`${url('jws')}/make_jws`, payload);

      expect(response).to.have.status(HTTP200);
      after(() => {
        // console.log(response.valueOf().body);
      });

      return chakram.wait().then(() => {
        jwsToken = response.valueOf().body.token;
      });
    });
  });
  describe('GET /hello', () => {
    it('return 401 when undefined token', () => {
      const response = chakram.get(`${url('main')}/hello`);

      expect(response).to.have.status(HTTP401);

      return chakram.wait();
    });
    it('return 401 when token is not a string', () => {
      const response = chakram.get(`${url('main')}/hello?access_token={}`);

      expect(response).to.have.status(HTTP401);

      return chakram.wait();
    });
    it('return 401 for ?access_token=wrong_token', () => {
      const response = chakram.get(`${url('main')}/hello?access_token=wrong_token`);

      expect(response).to.have.status(HTTP401);

      return chakram.wait();
    });
    it('return 401 for header Authorization: Bearer wrong_token', () => {
      const options = {
        'headers': {
          'Authorization': 'Bearer wrong_token'
        }
      };
      const response = chakram.get(`${url('main')}/hello`, options);

      expect(response).to.have.status(HTTP401);
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });
    it('return 200 for ?access_token=... & valid token', () => {
      const response = chakram.get(`${url('main')}/hello?access_token=${jwsToken}`);

      expect(response).to.have.status(HTTP200);
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });
    it('return 200 for header Authorization: Bearer & valid token', () => {
      const options = {
        'headers': {
          'Authorization': `Bearer ${jwsToken}`
        }
      };
      const response = chakram.get(`${url('main')}/hello`, options);

      expect(response).to.have.status(HTTP200);
      after(() => {
        // console.log(response.valueOf().body);
      });
      return chakram.wait();
    });
    describe('Bad Request', () => {
      it('return 401 for JWKS endpoint not found', () => {
        jwsExpress({
          jwks: 'http://127.0.0.1/nowhere'
        });
        const response = chakram.get(`${url('main')}/hello?access_token=${jwsToken}`);

        expect(response).to.have.status(HTTP401);
        after(() => {
          // console.log(response.valueOf().body);
        });
        return chakram.wait();
      });
      it('return 401 for JWKS endpoint returning bad content', () => {
        jwsExpress({
          jwks: 'http://www.google.com'
        });
        const response = chakram.get(`${url('main')}/hello?access_token=${jwsToken}`);

        expect(response).to.have.status(HTTP401);
        after(() => {
          // console.log(response.valueOf().body);
        });
        return chakram.wait();
      });
    });
});

  after('stop service', () => {
    services.main.server.close();
    services.jws.server.close();
  });
});
