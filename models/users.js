const User = require("../service/schemas/users");
const gravatar = require("gravatar");

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

const removeUser = async (id) => {
  try {
    return await User.findByIdAndRemove(id);
  } catch (error) {
    console.log(`Error removing User with id ${id}: `, error);
    throw error;
  }
};

const signup = async (body) => {
  const existingUser = await User.findOne(body);
  if (existingUser) {
    return 409;
  }
  const avatarURL = gravatar.url(body.email, { s: "250", r: "pg", d: "retro" });
  const user = { ...body, avatarURL };
  try {
    return await User.create(user);
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
