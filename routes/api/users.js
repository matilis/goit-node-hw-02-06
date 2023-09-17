const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const users = require("../../models/users");
const { auth } = require("../../config/auth");
const { upload } = require("../../config/multer");

require("dotenv").config();
const secret = process.env.SECRET;

router.post("/signup", async (req, res, next) => {
  const { email, password, subscription } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Error! Missing fields! Empty request is not allowed" });
  }
  try {
    const user = await users.signup(req.body);
    if (user === 409) {
      return res.status(409).json({ message: "Email in use" });
    }
    return res.status(201).json({
      status: "User added",
      code: 201,
      user: { email, subscription },
    });
  } catch (error) {
    res.status(500).json(`User could not be created: ${error}`);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Error! Missing fields! Empty request is not allowed" });
  }

  try {
    const user = await users.login(req.body);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Error! Email or password is wrong!" });
    }
    const { id, subscription, avatarURL } = user;
    const payload = {
      id,
      email,
      subscription,
      avatarURL,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    user.token = token;
    await user.save();

    res.status(200).json({
      status: "success",
      code: 200,
      token: token,
      user: { email, subscription, avatarURL },
    });
  } catch (error) {
    res.status(500).json(`An error occurred while adding the user: ${error}`);
  }
});

router.get("/current", auth, async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await users.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Error! User not found!" });
    }
    const { email, subscription, avatarURL } = user;
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { email, subscription, avatarURL },
    });
  } catch (err) {
    res.status(500).json(`An error occurred while getting the contact: ${err}`);
  }
});

router.get("/logout", auth, async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await users.getUserById(id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json(`An error occurred while logging out: ${error}`);
  }
});

router.patch("/", auth, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;

    if (!["starter", "pro", "business"].includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription value" });
    }

    const user = await users.getUserById(id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.subscription = subscription;
    await user.save();

    res.status(200).json({
      status: "success",
      code: 200,
      data: { subscription: user.subscription },
    });
  } catch (error) {
    res.status(500).json({
      message: `An error occurred while updating subscription: ${error}`,
    });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const usersList = await users.allUsers();
    res.status(200).json({
      message: "success",
      data: { usersList },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await users.getUserById(userId);

    if (user) {
      res.status(200).json({
        message: "success",
        data: { user },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const deletedUser = await users.removeUser(userId);

    if (deletedUser) {
      res.status(200).json({
        message: "success",
        data: { deletedUser },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
});

module.exports = router;
