const CharacterModel = require('../models/character');

const getAll = async () => CharacterModel.findAll();

module.exports = { getAll };
