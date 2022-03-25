const { Op } = require('sequelize');
const sequelize = require('sequelize');
const MediaModel = require('../models/media');
const CharacterModel = require('../models/character');
const GenreModel = require('../models/genre');

// TODO: Filter by genre
const getAll = async (title, genre, order) => {
  const params = {};
  if (order) {
    params.order = [['release_date', order]];
  }
  if (title) {
    params.where = {
      title: {
        [Op.like]: `%${title}%`
      }
    };
  }
  if (genre) {
    const fetchedGenre = await GenreModel.findOne({ where: { name: genre } });
    if (fetchedGenre) {
      if (params.where) {
        params.where.genreId = fetchedGenre.id;
      } else {
        params.where = {
          genreId: fetchedGenre.id
        };
      }
    }
  }

  return MediaModel.findAll(params);
};

/**
 * @return {Promise<MediaModel>}
 * */
const getByTitle = async (title) => MediaModel.findOne({ where: { title } });

const getDetails = async (title) => {
  const media = (await MediaModel.findOne({ where: { title } }, { include: CharacterModel }));
  const res = media.dataValues;
  res.characters = (await media.getCharacters()).map((c) => ({
    name: c.name,
    age: c.age,
    weight: c.weight,
    background_story: c.background_story,
    image_url: c.image_url
  }));

  return res;
};

const createMedia = async ({ image_url, score, title, release_date }) => {
  if (typeof image_url !== 'string') throw new TypeError('parameter image_url should be of type string');
  if (typeof release_date !== 'string') throw new TypeError('parameter release_date should be of type string');
  if (typeof title !== 'string') throw new TypeError('parameter title should be of type string');
  if (typeof score !== 'number' && typeof score !== 'string') throw new TypeError('parameter score should be of type number');
  score = Number(score);
  await MediaModel.create({ image_url, score, title, release_date });
};

/**
 * @param media {MediaModel}
 * */
const updateMedia = async (media, newValues) => {
  if (newValues.id) {
    // Id should be kept as is
    delete newValues.id;
  }
  media.set(newValues);
  await media.save();
};

const deleteMedia = async (title) => {
  const media = await MediaModel.findOne({ where: { title } });
  await media.destroy();
};

module.exports = {
  createMedia,
  deleteMedia,
  updateMedia,
  getAll,
  getByTitle,
  getDetails
};
