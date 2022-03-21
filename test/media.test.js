const setup = require('../setup');
const { assert } = require('chai');
const {
  createMedia, deleteMedia, updateMedia, getDetails
} = require('../src/services/media');

const MediaModel = require('../src/models/media');
const CharacterModel = require('../src/models/character');

describe('Media services', () => {
  beforeEach('Setup app', async () => {
    app = await setup(':memory:', true, true);
  });
  describe('createMedia', () => {
    it('createMedia should create a new media entry given the passed arguments', async () => {
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test',
        release_date: '1/1/2000'
      });

      const media = await MediaModel.findByPk(1);

      assert.ok(media);
      assert.equal(media.score, 5);
      assert.equal(media.title, 'test');
      assert.equal(media.release_date, '1/1/2000');
    });
    it('createMedia should throw an exception when passed an empty object', async () => {
      try {
        await createMedia({});
        assert.isTrue(false, 'createMedia shouldve thrown an exception');
      } catch (e) { }
    });
    it('createMedia should throw an exception when passed insufficient arguments', async () => {
      let ok = false;
      try {
        await createMedia({ title: 1, release_date: '1', image_url: 'aa' });
      } catch (e) {
        ok = true;
      }
      assert.isTrue(ok, 'createMedia shouldve thrown an exception');
    });
  });
  describe('updateMedia', () => {
    it('updateMedia should change the matched entry with the new values', async () => {
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test',
        release_date: '1/1/2000'
      });

      const media = await MediaModel.findByPk(1);

      await updateMedia(media, { score: 2 });

      const updtdMedia = await MediaModel.findByPk(1);

      assert.equal(updtdMedia.score, 2);
    });
  });
  describe('deleteMedia', () => {
    it('deleteMedia should delete media matching title passed as argument', async () => {
      await createMedia({
        image_url: 'www.test.com',
        score: 5,
        title: 'test',
        release_date: '1/1/2000'
      });

      await deleteMedia('test');

      assert.notOk(await MediaModel.findOne({ where: { title: 'test' } }));
    });
    it('deleteMedia should throw an exception if a title that doesnt match any entry is passed as argument', async () => {
      let ok = false;
      try {
        await deleteMedia('this title doesnt exist');
      } catch (e) {
        ok = true;
      }
      assert.isTrue(ok, 'createMedia shouldve thrown an exception');
    });
  });
  describe('getDetails', () => {
    it(
      'getDetails should return all fields related to the movie/series together with its characters',
      async () => {
        await MediaModel.build({
          image_url: 'www.test.com', score: 5, title: 'test', release_date: '1/1/2000'
        }).save();
        await CharacterModel.build({
          name: 'Mickey Mouse',
          background_story: 'this is the background story',
          image_url: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png'
        }).save();

        const character = await CharacterModel.findByPk(1);
        const media = await MediaModel.findByPk(1);

        assert.isOk(character);
        assert.isOk(media);

        await media.addCharacter(character);

        const details = await getDetails(media.title);

        assert.equal(details.title, 'test');
        assert.equal(details.characters[0].name, 'Mickey Mouse');
      }
    );
  });
});
