const setup = require('../setup');
const { assert } = require('chai');
const {
  createMedia, deleteMedia, getAll, updateMedia, getByTitle, getDetails
} = require('../src/services/media');

const MediaModel = require('../src/models/media');
const CharacterModel = require('../src/models/character');
const CharacterMediaModel = require('../src/models/character_media');

describe('media services', () => {
  beforeEach('Setup app', async () => {
    app = await setup(':memory:', true, true);
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
