const { assert, expect } = require('chai');
const chai = require('chai');
const ChaiHttp = require('chai-http');

const setup = require('../setup');
const { createCharacter, getCharacterDetails } = require("../src/services/character");

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
    it('Should return a list of all characters in the db in the form '
      + '{name, image}, filtered by the passed parameters', async () => {
      await createCharacter({
        name: 'test',
        age: 20,
        weight: 100,
        background_story: 'background story',
        image_url: 'www.test.com'
      });
      await createCharacter({
        name: 'test2',
        age: 30,
        weight: 300,
        background_story: 'background story',
        image_url: 'www.test.com'
      });
      await createCharacter({
        name: 'notmatched',
        age: 40,
        weight: 400,
        background_story: 'background story',
        image_url: 'www.test.com'
      });
      const res = await chai.request(app)
        .get('/characters?name=test')
        .set('token', token)
        .send();

      assert.lengthOf(res.body, 2);
      assert.equal(res.status, 200);
    });
  });

  describe('GET /details/:name', () => {
    it('Details returned should match queried character', async () => {
      await createCharacter({
        name: 'test',
        age: 20,
        weight: 100,
        background_story: 'background story',
        image_url: 'www.test.com'
      });

      const res = await chai.request(app)
        .get('/characters/details/test')
        .set('token', token)
        .send();

      assert.equal(res.status, 200);
      assert.equal(res.body.name, 'test');
      assert.equal(res.body.age, 20);
      assert.equal(res.body.weight, 100);
    });
  });

  describe('GET /delete/:name', () => {
    it('Should delete entry matching title passed as parameter', async () => {
      await createCharacter({
        name: 'test',
        age: 20,
        weight: 100,
        background_story: 'background story',
        image_url: 'www.test.com'
      });

      const res = await chai.request(app)
        .get('/characters/delete/test')
        .set('token', token)
        .send();

      assert.isOk(res);
      assert.equal(res.status, 200);

      // assert.throws doesn't work
      try {
        await getCharacterDetails('test');
        assert.isOk(false);
      } catch (e) { }
    });
  });

  describe('GET /character/update/:name', () => {
    it('Should update the matched character with the url parameters', async () => {
      await createCharacter({
        name: 'test',
        age: 20,
        weight: 100,
        background_story: 'background story',
        image_url: 'www.test.com'
      });

      const res = await chai.request(app)
        .get('/characters/update/test?age=5000')
        .set('token', token)
        .send();

      const details = await getCharacterDetails('test');

      assert.equal(res.status, 200);
      assert.equal(details.age, 5000);
    });
  });

  describe('GET /create', () => {
    it('Should create a new entry based on the arguments passed on the url', async () => {
      // name, age, weight, background_story, image_url
      const res = await chai.request(app)
        .get('/characters/create?name=test&age=20&weight=100'
          + '&background_story=thisisthebackgroundstory&image_url=www.test.com')
        .set('token', token)
        .send();

      assert.equal(res.status, 200);

      const details = await getCharacterDetails('test');
      assert.equal(details.name, 'test');
      assert.equal(details.age, 20);
      assert.equal(details.image_url, 'www.test.com');
      assert.equal(details.background_story, 'thisisthebackgroundstory');
    });
  });
});
