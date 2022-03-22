const { assert } = require('chai');
const chai = require('chai');
const ChaiHttp = require('chai-http');

const setup = require('../setup');

const { createMedia, getByTitle} = require('../src/services/media');
const GenreModel = require('../src/models/genre');
const MediaModel = require('../src/models/media');

let token = '';
let app = null;

describe('Media routes', () => {
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

  describe('GET /movies', () => {
    it('Should return a list of movies including only title, image and release date fields, '
      + 'properly filtered by genre and title, and ordered by the specified order', async () => {
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test',
        release_date: '1/1/2001'
      });
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'the test is a lie',
        release_date: '1/1/2001'
      });
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test2',
        release_date: '1/1/2000'
      });
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'alternate title',
        release_date: '1/1/2000'
      });

      await GenreModel.create({ name: 'testgenre', image_url: 'www.test.com' });
      await GenreModel.create({ name: 'alternategenre', image_url: 'www.test.com' });

      const testGenre = await GenreModel.findOne({ where: { name: 'testgenre' } });
      const altGenre = await GenreModel.findOne({ where: { name: 'alternategenre' } });
      const medias = await MediaModel.findAll();

      await testGenre.addMedium(medias[0]);
      await altGenre.addMedium(medias[1]);
      await testGenre.addMedium(medias[2]);
      await altGenre.addMedium(medias[3]);

      const res = await chai.request(app)
        .get('/movies?order=asc&title=test&genre=testgenre')
        .set('token', token)
        .send();

      assert.equal(res.status, 200);
      // Two entries are matched
      assert.lengthOf(res.body, 2);
      // Desc order
      assert.equal(res.body[0].title, 'test2');
      assert.equal(res.body[1].title, 'test');
    });
  });
  describe('GET /movies/details/:title', () => {
    it('Should return movie details matching title passed as route parameter', async () => {
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test',
        release_date: '1/1/2001'
      });

      const res = await chai.request(app)
        .get('/movies/details/test')
        .set('token', token)
        .send();

      assert.isOk(res.body);
      assert.equal(res.body.title, 'test');
    });
    it('Should return a 500 code when a movie with the passed title doesnt exist', async () => {
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test',
        release_date: '1/1/2001'
      });

      const res = await chai.request(app)
        .get('/movies/details/doesntexist')
        .set('token', token)
        .send();

      assert.isOk(res.body);
      assert.equal(res.status, 500);
    });
  });
  describe('GET movies/delete/:title', () => {
    it('Should delete the movie that matches the title parameter', async () => {
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test',
        release_date: '1/1/2001'
      });

      const res = await chai.request(app)
        .get('/movies/delete/test')
        .set('token', token)
        .send();

      assert.equal(res.status, 200);
      let ok = true;
      try {
        const movie = await getByTitle('test');
        if (movie) {
          ok = false;
        }
      } catch (e) { }
      assert.isTrue(ok);
    });
  });
  describe('GET movies/create/', () => {
    it('Should create a movie entry based on the given parameters', async () => {
      const res = await chai.request(app)
        .get('/movies/create?title=test&score=5&release_date=1/1/2001&image_url=www.test.com')
        .set('token', token)
        .send();

      assert.equal(res.status, 200);

      const movie = await getByTitle('test');

      assert.isOk(movie);
      assert.equal(movie.title, 'test');
    });
  });
  describe('GET movies/update/:title', () => {
    it('Should create a movie entry based on the given parameters', async () => {
      await createMedia({
        image_url: 'www.test2.com',
        score: 2,
        title: 'test',
        release_date: '1/1/2000'
      });
      const res = await chai.request(app)
        .get('/movies/update/test?score=5&release_date=1/1/2001&image_url=www.test.com')
        .set('token', token)
        .send();

      assert.equal(res.status, 200);

      const movie = await getByTitle('test');

      assert.isOk(movie);
      assert.equal(movie.score, 5);
      assert.equal(movie.image_url, 'www.test.com');
    });
  });
});
