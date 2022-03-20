const CharacterModel = require('../models/character');

const getAll = async () => CharacterModel.findAll();

const createCharacter = async ({ name, age, weight, background_story, image_url }) => {
  await CharacterModel.build({ name, age, weight, background_story, image_url }).save();
};

/**
 * @param character {CharacterModel}
 * */
const updateCharacter = async (character, newValues) => {
  character.set(newValues);
  await character.save();
};

const deleteCharacter = async (charName) => {
  const character = await CharacterModel.findOne({ name: charName });
  await character.destroy();
};

module.exports = {
  getAll,
  createCharacter,
  updateCharacter,
  deleteCharacter
};
