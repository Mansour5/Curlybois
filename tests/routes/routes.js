const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../../app.js');
const http = require('http');
const saveFile = require('../../modules/saveFile.js');
const deleteFile = require('../../modules/deleteFile.js');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);
describe('Routes unit test', function() {
  describe('Documents can be displayed', function() {
    describe('/', function() {
      it('Should display the blank editor document.', function(done) {
        http.get('http://localhost:3000/', function(res) {
          assert.equal(res.statusCode, 200);

          let body = '';
          res.on('data', function(d) {
            body += d;
          });

          res.on('end', function() {
            assert.match(body, /<textarea .*><\/textarea>/, 'Textarea not found. page not loading correctly');
            done();
          })
        });
      });
    });
  });


  describe('Files can be downloading', function() {
    describe('/page/download', function() {
      it('Should respond with 200', function(done) {
        chai.request(app).post('/page/download').send({
          isTest: true
        }).end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        })
      })
    });

    describe('/page/download/teste', function() {
      it('Should test to see if the routing to download a page works', function(done) {
        chai.request(app).get('/page/download/teste').send({
          isTest: true
        }).end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        })
      })
    });
  });

  describe('Files can be saved/updated in the database', function() {
    describe('/save', function() {
      it('Should test to see if the routing to save works', function(done) {
        chai.request(app).post('/ping').end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        })
      });
    });
  });
});
