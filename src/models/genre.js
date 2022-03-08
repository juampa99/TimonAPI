const { Model, DataTypes: { INTEGER, STRING }, } = require('sequelize');

module.exports = class GenreModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof GenreModel}
   * */
  static setup(sequelizeInstance) {
    GenreModel.init({
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING,
        allowNull: false
      },
      image_url: {
        type: STRING,
        allowNull: true
      }
    }, {
      sequelize: sequelizeInstance,
      modelName: 'genre',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    })
    return GenreModel;
  }
}