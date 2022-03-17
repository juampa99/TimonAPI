const UserModel = require('../models/user');

// TODO: Password should be encrypted before saving
const register = async (email, password) => UserModel.build({ email, password }).save();

const getUser = async (email) => UserModel.findOne({ where: { email } });

module.exports = { getUser, register };
