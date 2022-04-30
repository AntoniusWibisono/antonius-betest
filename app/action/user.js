const { encryptPass } = require('../helpers/util');
const User = require('../model/user');

const createUser = async (data) => {
  try {
    data.password = encryptPass(data.password);
    const result = await User.create(data);
    return result;
  }
  catch (error) {
    const message = error.message || error;
    throw message;
  }
};

const getUserByQuery = async (query) => {
  try {
    const result = await User.findOne(query, { password: 0, __v: 0 });
    return result;
  }
  catch (error) {
    const message = error.message || error;
    throw message;
  }
};

const getUserAuthByQuery = async (query) => {
  try {
    const result = await User.findOne(query, { password: 1, userName: 1, identityNumber: 1 });
    return result;
  }
  catch (error) {
    const message = error.message || error;
    throw message;
  }
};

const updateUserById = async (id, data) => {
  try {
    const result = await User.findOneAndUpdate({ _id: id }, { $set: data }, { new: true });
    return result;
  }
  catch (error) {
    const message = error.message || error;
    throw message;
  }
};

const deleteUserById = async (id) => {
  try {
    const result = await User.findOneAndDelete({ _id: id });
    return result;
  }
  catch (error) {
    const message = error.message || error;
    throw message;
  }
};

module.exports = {
  createUser,
  getUserByQuery,
  updateUserById,
  deleteUserById,
  getUserAuthByQuery
};
