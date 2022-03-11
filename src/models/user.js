const { Model, DataTypes: { INTEGER, STRING }, } = require('sequelize');

module.exports = class UserModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof UserModel}
   * */
  static setup(sequelizeInstance) {
    UserModel.init({
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: STRING,
        allowNull: false
      }
    }, {
      sequelize: sequelizeInstance,
      modelName: 'user',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return UserModel;
  }
};
