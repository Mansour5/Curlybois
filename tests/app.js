const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../app.js');
const http = require('http');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);
describe('App unit test', function() {
  describe('Server starts test', function() {
    describe('/ping', function() {
      it('Should return pong.', function(done) {
        http.get('http://localhost:3000/ping', function(res) {

          assert.equal(res.statusCode, 200);
          let body = '';
          res.on('data', function(d) {
            body += d;
          });

          res.on('end', function() {
            assert.equal(body, 'pong');
            done();
          })
        });
      });
    });
  });
});
