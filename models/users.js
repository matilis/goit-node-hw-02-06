const User = require("../service/schemas/users");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs/promises");

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
  const { email } = body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return 409;
  }
  const userAvatar = gravatar
    .url(email, { s: "250", r: "pg", d: "retro" })
    .replace(/^\/\//, "https://");
  const user = { ...body, avatarURL: userAvatar };
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

const patchAvatar = async (filePath, id) => {
  try {
    const localPath = `public/avatars/avatar-${id}.jpg`;
    const serverPath = `/${localPath.replace(/^public\//, "")}`;

    const avatarSize = await Jimp.read(filePath);
    await avatarSize.resize(250, 250).quality(60).writeAsync(localPath);

    await User.findByIdAndUpdate(
      { _id: id },
      { $set: { avatarURL: localPath } },
      { new: true, select: "avatarURL" }
    );

    await fs.unlink(filePath);
    return serverPath;
  } catch (error) {
    console.error("An error occurred while updating avatar: ", error);
    throw error;
  }
};

module.exports = {
  allUsers,
  getUserById,
  removeUser,
  signup,
  login,
  patchAvatar,
};
