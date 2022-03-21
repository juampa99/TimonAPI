const { Model, DataTypes: { INTEGER }, } = require('sequelize');

module.exports = class CharacterMediaModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof CharacterMediaModel}
   * */
  static setup(sequelizeInstance) {
    CharacterMediaModel.init({
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      sequelize: sequelizeInstance,
      modelName: 'character_media',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

    return CharacterMediaModel;
  }
}
