const { assert } = require('chai');

const setup = require('../setup');

const CharacterModel = require('../src/models/character');
const { getAll, createCharacter, updateCharacter, deleteCharacter } = require('../src/services/character');

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
      characters.forEach((c) => assert.typeOf(c.name, 'string'));
      characters.forEach((c) => assert.typeOf(c.image_url, 'string'));
    });
  });
  describe('createCharacter', () => {
    it('createCharacter must create a new register with the given parameters', async () => {
      await createCharacter({
        name: 'Goofy',
        age: 135,
        weight: 100,
        background_story: 'This is the brackground story',
        image_url: 'https://example.com'
      });
      const character = await CharacterModel.findOne({ name: 'Goofy' });

      assert.ok(character);
      assert.equal(character.name, 'Goofy');
      assert.equal(character.age, 135);
      assert.equal(character.weight, 100);
      assert.equal(character.image_url, 'https://example.com');
    });
    it('createCharacter must throw an exception if non nullable parameters are passed as null', async () => {
      try {
        await createCharacter({
          name: 'Goofy',
          age: null,
          weight: 100,
          background_story: 'This is the brackground story',
          image_url: 'https://example.com'
        });
        assert.isTrue(false);
      } catch (e) { }
    });
  });
  describe('updateCharacter', () => {
    it('updateCharacter must update character properties with the given parameters', async () => {
      // Create dummy character
      await createCharacter({
        name: 'Goofy',
        age: 135,
        weight: 100,
        background_story: 'This is the background story',
        image_url: 'https://example.com'
      });
      const character = await CharacterModel.findOne({ name: 'Goofy' });
      // Change character weight
      await updateCharacter(character, { weight: 200 });
      // Get updated character from the database
      const updatedCharacter = await CharacterModel.findOne({ name: 'Goofy' });

      assert.equal(updatedCharacter.weight, 200);
      // Verify it's the same entry
      assert.equal(updatedCharacter.id, character.id);
    });
  });
  describe('deleteCharacter', () => {
    it('deleteCharacter must delete the character that matches the name passed as argument', async () => {
      await createRegisters(1);
      const character = await CharacterModel.findOne({ name: 'Mickey Mouse 1' });
      assert.ok(character);

      await deleteCharacter(character.name);
      const character2 = await CharacterModel.findOne({ name: 'Mickey Mouse 1' });

      // Should be undefined
      assert.isNotOk(character2);
    });
  });
});
