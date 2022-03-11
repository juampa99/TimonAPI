const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const UserModel = require('./src/models/user');
const CharacterModel = require('./src/models/character');
const MediaModel = require('./src/models/media');
const GenreModel = require('./src/models/genre');
const auth = require('./src/routes/auth');

const setupDb = () => new Sequelize({
  dialect: process.env.DB_DIALECT,
  storage: process.env.DB_PATH || `${process.cwd()}/data/database.db`,
  /* Change this if you want to avoid spam on your terminal :D */
  logging: console.log
});

/**
* @param {Sequelize} sequelizeInstance
* @param {boolean} force Creates all tables, dropping old ones if they already exist,
* recommended for first time setup
* */
const setupModels = async (sequelizeInstance, force = false) => {
  UserModel.setup(sequelizeInstance);
  MediaModel.setup(sequelizeInstance);
  CharacterModel.setup(sequelizeInstance);
  GenreModel.setup(sequelizeInstance);

  await UserModel.sync({ force });
  await MediaModel.sync({ force });
  await CharacterModel.sync({ force });
  await GenreModel.sync({ force });

  sequelizeInstance.sync({ force });
};

const setupParsers = (app) => {
  app.use(bodyParser.json());
};

const setupRouters = (app) => {
  app.use('/auth', auth);
};

const checkForSecurityConcerns = () => {
  if (!process.env.JWT_KEY) {
    console.warn('[WARNING] Please set the JWT_KEY environment variable in an .env '
      + 'file in the root directory of the project, defaulting to "SECRET_KEY" string');
  }
};

const setup = () => {
  const app = express();
  const sequelizeInstance = setupDb();

  setupModels(sequelizeInstance, false);
  setupParsers(app);
  setupRouters(app);
  checkForSecurityConcerns();


  return app;
};

module.exports = setup;
