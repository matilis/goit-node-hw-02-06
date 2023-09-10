const User = require("../service/schemas/users");

const allUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.log("Error getting User list: ", error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.log(`Error getting User with id ${id}: `, error);
    throw error;
  }
};

const removeUser = async (userId) => {
  try {
    return await User.findByIdAndRemove({ _id: userId });
  } catch (error) {
    console.log(`Error removing User with id ${userId}: `, error);
    throw error;
  }
};

const signup = async (body) => {
  const existingUser = await User.findOne(body);
  if (existingUser) {
    return 409;
  }
  try {
    return await User.create(body);
  } catch (error) {
    console.log("Error adding new user: ", error);
    throw error;
  }
};

const login = async (body) => {
  try {
    return await User.findOne(body);
  } catch (error) {
    console.log("Error logging in: ", error);
    throw error;
  }
};

module.exports = {
  allUsers,
  getUserById,
  removeUser,
  signup,
  login,
};
