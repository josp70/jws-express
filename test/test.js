/* eslint no-process-env: "off" */
/* global describe, it, after, before */

process.env.NODE_ENV = 'test';

const chakram = require('chakram');
const {expect} = chakram;

const service = require('./fixture/service');

const HTTP200 = 200;

describe('JWKS-VERIFY-EXPRESS', () => {
  let port = 0;
  let url = '';

  before('start server', (done) => {
    service.start();
    service.app.on('ready', () => {
      ({port} = service.server.address());
      url = `http://localhost:${port}`;
      done();
    });
  });

  describe('GET /hello', () => {
    it('return 200 & undefined token', () => {
      const response = chakram.get(`${url}/hello`);

      expect(response).to.have.status(HTTP200);

      return chakram.wait().then(() => expect(response
        .valueOf().body).to.equal('Hello World: undefined'));
    });
    it('return 200 & known token on ?access_token=token', () => {
      const response = chakram.get(`${url}/hello?access_token=token`);

      expect(response).to.have.status(HTTP200);

      return chakram.wait().then(() => expect(response
        .valueOf().body).to.equal('Hello World: token'));
    });
    it('return 200 & known token on Authorization: Bearer token', () => {
      const options = {
        'headers': {
          'Authorization': 'Bearer token'
        }
      };
      const response = chakram.get(`${url}/hello`, options);

      expect(response).to.have.status(HTTP200);

      return chakram.wait().then(() => expect(response
        .valueOf().body).to.equal('Hello World: token'));
    });
  });

  after('stop service', () => {
    service.server.close();
  });
});
