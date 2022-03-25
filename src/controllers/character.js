const { getAll, getCharacterDetails, deleteCharacter, updateCharacter, createCharacter} = require('../services/character');
const CharacterModel = require("../models/character");

const getAllCharacters = async (req, res) => {
  try {
    const rawCharacters = await getAll(req.query.name, req.query.age, req.query.movieId);
    const parsedCharList = rawCharacters.map((c) => ({ image: c.image_url, name: c.name }));
    res.json(parsedCharList);
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error retrieving characters' });
  }
};

const getDetails = async (req, res) => {
  try {
    const details = await getCharacterDetails(req.params.name);
    res.json(details);
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error retrieving character' });
  }
};

const deleteCharacterRoute = async (req, res) => {
  try {
    await deleteCharacter(req.params.name);
    res.json({ message: `Successfully deleted ${req.params.name}` });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error deleting character' });
  }
};

const updateCharacterRoute = async (req, res) => {
  try {
    const character = await CharacterModel.findOne({ where: { name: req.params.name } });
    await updateCharacter(character, req.query);
    res.json({ message: `Successfully updated ${req.params.name}` });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error updating character' });
  }
};

const createCharacterRoute = async (req, res) => {
  try {
    await createCharacter(req.query);
    res.json({ message: `Successfully created ${req.query.name}` });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error updating character' });
  }
};

module.exports = { getAllCharacters, getDetails, deleteCharacterRoute, updateCharacterRoute, createCharacterRoute };
