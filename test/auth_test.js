'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const request = chai.request;

const mongoose = require('mongoose');
const basicHTTP = require('../lib/basic_http');
const dbPort = process.env.MONGOLAB_URI;

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';
require('../server.js');

describe('authentication integration tests', () => {
  before((done) => {
    request('localhost:5000')
      .post('/signup')
      .send({username: 'testname', password: 'testpassword'})
      .end((err) => {
        if(err) console.log(err.message);
        done();
      });
  });
  after((done) => {
    process.env.MONGOLAB_URI = dbPort;
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  it('should get a token upon signin', (done) => {
    request('localhost:5000')
      .get('/signin')
      .auth('testname', 'testpassword')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('should be able to signup a new user', (done) => {
    request('localhost:5000')
      .post('/signup')
      .send({username:'secondname', password: 'secondpassword'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});
describe('unit tests', () => {
  it('basicHTTP should produce our req.auth object from a req.headers.authorization string', (done) => {
    let newRequest = {};
    newRequest.headers = {};
    newRequest.headers.authorization = 'Basic c2ltb25zemM6bXlwYXNzd29yZA==';
    basicHTTP(newRequest, {}, () => {
      expect(newRequest.auth).to.have.property('username');
      expect(newRequest.auth.username).to.eql('simonszc');
      expect(newRequest.auth).to.have.property('password');
      expect(newRequest.auth.password).to.eql('mypassword');
      done();
    });
  })
})
