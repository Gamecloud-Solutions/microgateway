// © Copyright IBM Corporation 2016,2017.
// Node module: microgateway
// LICENSE: Apache 2.0, https://www.apache.org/licenses/LICENSE-2.0

'use strict';

var mg = require('../lib/microgw');
var supertest = require('supertest');
var dsCleanupFile = require('./support/utils').dsCleanupFile;
var resetLimiterCache = require('../lib/rate-limit/util').resetLimiterCache;

var request;

describe('switchPolicyTesting', function() {
  before(function(done) {
    process.env.CONFIG_DIR = __dirname + '/definitions/operation-switch';
    process.env.NODE_ENV = 'production';

    resetLimiterCache();
    mg.start(3000)
      .then(function() {
        request = supertest('http://localhost:3000');
      })
      .then(done)
      .catch(function(err) {
        console.error(err);
        done(err);
      });
  });

  after(function(done) {
    dsCleanupFile();
    mg.stop()
      .then(done, done)
      .catch(done);
    delete process.env.CONFIG_DIR;
    delete process.env.NODE_ENV;
  });

  it('switchOnVerbAndPath', switchOnVerbAndPath);
  it('switchOnOperationId1', switchOnOperationId1);
  it('switchOnOperationId2', switchOnOperationId2);
  it('switchOnOperationId3', switchOnOperationId3);
  it('switchNoCase', switchNoCase);
});

function switchOnVerbAndPath(doneCB) {
  request.post('/customer')
    .expect(200, /A new customer is created/, doneCB);
}

function switchOnOperationId1(doneCB) {
  request.post('/order')
    .expect(200, /A new order is created/, doneCB);
}

function switchOnOperationId2(doneCB) {
  request.put('/order')
    .expect(200, /The given order is updated/, doneCB);
}

function switchOnOperationId3(doneCB) {
  request.delete('/order')
    .expect(500, /Deleting orders is not allowed/, doneCB);
}

// Cannot Get /order
function switchNoCase(doneCB) {
  request.get('/order')
    .expect(500, doneCB);
}

