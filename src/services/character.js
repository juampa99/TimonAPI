const CharacterModel = require('../models/character');
const { Op } = require('sequelize');
const MediaModel = require("../models/media");

const getAll = async (name, age, movieId) => {
  const params = {};
  params.where = {};

  if (name) {
    params.where.name = {
      [Op.like]: `%${name}%`
    };
  }
  if (age) {
    params.where.age = age;
  }
  if (movieId) {
    params.where.movieId = movieId;
  }

  return CharacterModel.findAll(params);
};

const createCharacter = async ({ name, age, weight, background_story, image_url }) => {
  if (typeof name !== 'string') throw new TypeError('parameter name should be of type string');
  if (typeof background_story !== 'string') throw new TypeError('parameter background_story should be of type string');
  if (typeof image_url !== 'string') throw new TypeError('parameter image_url should be of type string');
  if (typeof age !== 'number' && typeof age !== 'string') throw new TypeError('parameter age should be of type number');
  if (typeof weight !== 'number' && typeof weight !== 'string') throw new TypeError('parameter weight should be of type number');

  age = Number(age);
  weight = Number(weight);

  await CharacterModel.build({ name, age, weight, background_story, image_url }).save();
};

/**
 * @param character {CharacterModel}
 * */
const updateCharacter = async (character, newValues) => {
  if (newValues.id) {
    delete newValues.id;
  }
  character.set(newValues);
  await character.save();
};

const deleteCharacter = async (name) => {
  const character = await CharacterModel.findOne({ where: { name } });
  await character.destroy();
};

const getCharacterDetails = async (name) => {
  const character = (await CharacterModel.findOne({ where: { name } }, { include: MediaModel }));
  const res = character.dataValues;
  res.movies = (await character.getMedia()).map((m) => ({
    title: m.title,
    score: m.score,
    image_url: m.image_url,
    release_date: m.release_date
  }));

  return res;
};

module.exports = {
  getAll,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getCharacterDetails
};
