const MediaModel = require('../models/media');
const CharacterModel = require('../models/character');

const getAll = async () => MediaModel.findAll();

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
  await MediaModel.create({ image_url, score, title, release_date });
};

/**
 * @param media {MediaModel}
 * */
const updateMedia = async (media, newValues) => {
  media.set(newValues);
  await media.save();
};

const deleteMedia = async (mediaName) => {
  const media = await MediaModel.findOne({ name: mediaName });
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
