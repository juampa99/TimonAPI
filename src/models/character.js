const { Model, DataTypes: { INTEGER, STRING }, } = require('sequelize');

module.exports = class CharacterModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof CharacterModel}
   * */
  static setup(sequelizeInstance) {
    CharacterModel.init({
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING,
        allowNull: false
      },
      age: {
        type: INTEGER,
        allowNull: true
      },
      weight: {
        type: INTEGER,
        allowNull: true
      },
      background_story: {
        type: STRING,
        allowNull: true
      },
      image_url: {
        type: STRING,
        allowNull: true
      }
    }, {
      sequelize: sequelizeInstance,
      modelName: 'character',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    })
    return CharacterModel;
  }
}