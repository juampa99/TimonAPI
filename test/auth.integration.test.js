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

describe('Auth routes', () => {
  describe('POST /auth/login route', () => {
    it('Should return a 200 response and a key upon login', async () => {
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
      assert.ok(res.body.token);
    });

    it('Should fail to authenticate upon entering invalid email', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .type('json')
        .send({
          email: EMAIL,
          password: PASSWORD
        });
      assert.isTrue(res.status >= 300);
      assert.equal(res.body.message.toLowerCase(), 'invalid email');
    });

    it('Should fail to authenticate upon entering invalid password', async () => {
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
          password: 'notavalidpassword'
        });
      assert.isTrue(res.status >= 300);
      assert.equal(res.body.message.toLowerCase(), 'invalid password');
    });
  });
});
