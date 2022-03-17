const { assert } = require('chai');

const setup = require('../setup');
const { getUser, register } = require('../src/services/auth');

const EMAIL = 'testuser@example.com';
const PASSWORD = 'testpassworD123';

beforeEach('Setup app', async () => {
  await setup(':memory:', true, true);
});

describe('Auth services', () => {
  describe('getUser', () => {
    it('Should throw an exception for querying a user that doesnt exist', async () => {
      try {
        await getUser(EMAIL);
        assert.isTrue(false);
      } catch (e) {}
    });

    it('Should successfully retrieve a registered user', async () => {
      try {
        await register(EMAIL, PASSWORD);
        await getUser(EMAIL);
      } catch (e) {
        assert.isTrue(false);
      }
    });
  });

  describe('register', () => {
    it('Should add a register successfully', async () => {
      try {
        await register(EMAIL, PASSWORD);
        await getUser(EMAIL);
      } catch (e) {
        assert.isTrue(false);
      }
    });

    it('Should throw an exception for adding a duplicate user', async () => {
      try {
        await register(EMAIL);
        await register(EMAIL);
        assert.isTrue(false);
      } catch (e) {}
    });

    it('Should throw an exception for adding a user with an invalid email', async () => {
      try {
        await register('invalidemail', PASSWORD);
        assert.isTrue(false);
      } catch (e) {}
    });

    it('Should throw an exception for adding a user with an invalid password', async () => {
      try {
        await register(EMAIL, 'notavalidpassword');
        assert.isTrue(false);
      } catch (e) {}
    });
  });
});
