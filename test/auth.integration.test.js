const { assert } = require('chai');
const chai = require('chai');
const ChaiHttp = require('chai-http');

const setup = require('../setup');
const { getUser, register } = require('../src/services/auth');

chai.use(ChaiHttp);
const EMAIL = 'testuser@example.com';
const PASSWORD = 'testpassworD123';
let app = null;

beforeEach('Setup app', async () => {
  app = await setup(':memory:', true, true);
});

describe('Login route', () => {
  describe('Expected correct behaviour', () => {
    it('Should return a 200 response upon login', async () => {
      await chai.request(app)
        .post('/auth/register')
        .type('json')
        .send({
          email: EMAIL,
          password: PASSWORD
        });
      const res = await chai.request(app)
        .post('/auth/login')
        .type('json')
        .send({
          email: EMAIL,
          password: PASSWORD
        });
      assert.equal(res.status, 200);
    });
  });
});
