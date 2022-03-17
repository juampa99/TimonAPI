const { assert } = require('chai');

const setup = require('../setup');

const CharacterModel = require('../src/models/character');
const { getAll } = require('../src/services/character');

const createRegisters = async (amount) => {
  for (let i = 0; i < amount; i += 1) {
    await CharacterModel.build(
      {
        name: `Mickey Mouse ${i}`,
        age: null,
        weight: null,
        background_story: 'this is the background story',
        image_url: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Mickey_Mouse.png'
      }
    ).save();
  }
};

describe('Character services', () => {
  beforeEach('Setup app', async () => {
    app = await setup(':memory:', true, true);
  });
  describe('getAll', () => {
    it('getAll must return a list of all registers in the database', async () => {
      await createRegisters(10);
      const characters = await getAll();

      assert.ok(characters);
      assert.lengthOf(characters, 10);
    });
  });
});
