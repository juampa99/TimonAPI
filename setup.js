const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const PasswordValidator = require('password-validator');
const emailValidator = require('email-validator');

const UserModel = require('./src/models/user');
const CharacterModel = require('./src/models/character');
const MediaModel = require('./src/models/media');
const GenreModel = require('./src/models/genre');
const CharacterMediaModel = require('./src/models/character_media');
const auth = require('./src/routes/auth');
const media = require('./src/routes/media');
const character = require('./src/routes/character');
const { INTEGER } = require("sequelize").DataTypes;

const setupDb = (dbPath) => new Sequelize({
  dialect: 'sqlite',
  storage: dbPath || `${process.cwd()}/data/database.db`,
  /* Change this if you want to avoid spam on your terminal :D */
  logging: ()=> {}
});

const setupModelRelationships = () => {
  // Many to many
  CharacterModel.belongsToMany(MediaModel, { through: CharacterMediaModel });
  MediaModel.belongsToMany(CharacterModel, { through: CharacterMediaModel });

  CharacterModel.hasMany(CharacterMediaModel);
  CharacterMediaModel.belongsTo(CharacterModel);

  MediaModel.hasMany(CharacterMediaModel);
  CharacterMediaModel.belongsTo(MediaModel);

  // One to many
  GenreModel.hasMany(MediaModel);
};

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
  CharacterMediaModel.setup(sequelizeInstance);

  setupModelRelationships();

  await UserModel.sync({ force });
  await MediaModel.sync({ force });
  await CharacterModel.sync({ force });
  await GenreModel.sync({ force });
  await CharacterMediaModel.sync({ force });

  UserModel.prototype.setPassword = function (password) {
    this.password = password;
  };

  await sequelizeInstance.sync({ force });
};

const addHooksToModels = () => {
  UserModel.addHook('beforeSave', async (user, options) => {
    const schema = new PasswordValidator();

    // Passwords must be between 10 and 30 characters, have at least one lower case
    // and one upper case character and at least one digit. Passwords also can't have spaces
    schema
      .is().min(10)
      .is().max(30)
      .has().uppercase()
      .has().lowercase()
      .has().digits(1)
      .has().not().spaces();

    if (schema.validate(user.password)) {
      user.password = await bcrypt.hash(user.password, 10);
    } else {
      return Promise.reject(new Error("Password doesn't match criteria"));
    }

    if (!emailValidator.validate(user.email)) {
      return Promise.reject(new Error('Email is not valid'));
    }
  });
};

const setupParsers = (app) => {
  app.use(bodyParser.json());
};

const setupRouters = (app) => {
  app.use('/auth', auth);
  app.use('/characters', character);
  app.use('/movies', media);
};

const checkForSecurityConcerns = () => {
  if (!process.env.JWT_KEY) {
    console.warn('[WARNING] Please set the JWT_KEY environment variable in an .env '
      + 'file in the root directory of the project, defaulting to "SECRET_KEY" string');
  }
};

const setup = async (dbPath = process.env.DB_PATH, forceSync = false, isTest = false) => {
  const app = express();
  const sequelizeInstance = setupDb(dbPath);

  await setupModels(sequelizeInstance, forceSync);
  setupParsers(app);
  setupRouters(app);
  if (!isTest) {
    checkForSecurityConcerns();
  }
  addHooksToModels();

  return app;
};

module.exports = setup;
