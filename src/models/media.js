const { Model, DataTypes: { INTEGER, STRING }, } = require('sequelize');

module.exports = class MediaModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof MediaModel}
   * */
  static setup(sequelizeInstance) {
    MediaModel.init({
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      image_url: {
        type: STRING,
        allowNull: true
      },
      title: {
        type: STRING,
        allowNull: false,
        unique: true
      },
      release_date: {
        type: STRING,
        allowNull: false
      },
      score: {
        type: INTEGER,
        validate: {
          min: 1,
          max: 5
        },
        allowNull: true
      }
    }, {
      sequelize: sequelizeInstance,
      modelName: 'media',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return MediaModel;
  }
};
