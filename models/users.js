const User = require("../service/schemas/users");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");

const { verificationToken } = require("../service/schemas/users");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

require("dotenv").config();

const verificationMsg = (email, verificationToken) => {
  const message = {
    to: email,
    from: "nodehm06@gmail.com",
    subject: "Please verify your email",
    text: "Please click the link below to verify your email:",
    html: `Verify your email (verificationToken:${verificationToken}`,
  };

  console.log("Email:", message.to);
  console.log("From:", message.from);
  console.log("Subject:", message.subject);
  console.log("Text:", message.text);
  console.log("HTML:", message.html);

  return message;
};

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
  try {
    const userAvatar = gravatar
      .url(email, { s: "250", r: "pg", d: "retro" })
      .replace(/^\/\//, "https://");
    const verificationToken = uuidv4();
    const user = { ...body, avatarURL: userAvatar, verificationToken };
    await User.create(user);
    await sgMail.send(verificationMsg(email, verificationToken));
    return user;
  } catch (error) {
    console.log("Error adding new user: ", error);
    throw error;
  }
};

const verificationMail = async (email) => {
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { verificationToken },
      { new: true }
    );

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const { verify } = user;
    if (verify) {
      const error = new Error("Verification has already been completed");
      error.status = 400;
      throw error;
    }
    await sgMail.send(verificationMsg(email, user.verificationToken));
  } catch (error) {
    console.log("Error getting user list: ", error);
    throw error;
  }
};

const verificationUserEmail = async (verificationToken) => {
  try {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }
    const { verify } = user;
    if (verify) {
      const error = new Error("Verification has already been completed");
      error.status = 400;
      throw error;
    }
    await User.updateOne(
      { verificationToken },
      { verify: true, verificationToken: null }
    );
  } catch (error) {
    console.log("Błąd podczas weryfikacji użytkownika: ", error);
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
  verificationMail,
  verificationUserEmail,
};
