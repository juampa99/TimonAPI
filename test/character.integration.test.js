const { assert } = require('chai');
const chai = require('chai');
const ChaiHttp = require('chai-http');

const setup = require('../setup');

let token = '';
let app = null;

describe('Character routes', () => {
  beforeEach(async () => {
    app = await setup(':memory:', true, true);

    const EMAIL = 'testuser@example.com';
    const PASSWORD = 'testpassworD123';

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
    token = res.body.token;
  });

  describe('GET /characters', () => {
    it('Should return a list of all characters in the db in the form {name, image}', async () => {
      const res = await chai.request(app)
        .get('/characters')
        .set('token', token)
        .send();

      assert.equal(res.status, 200);
    });
  });
})