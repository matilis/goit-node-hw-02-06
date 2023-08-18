const express = require("express");
const router = express.Router();
const Joi = require("joi");

const postContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const putContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

const contacts = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.listContacts();
    res.status(200).json({
      message: "success",
      data: { contactsList },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);

    if (contact) {
      res.status(200).json({
        message: "success",
        data: { contact },
      });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newContact = req.body;

    const { error } = postContactSchema.validate(newContact);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        error: error.details[0].message,
      });
      return;
    }

    const createdContact = await contacts.addContact(newContact);

    res.status(201).json({
      message: "success",
      data: { createdContact },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await contacts.removeContact(contactId);

    if (deletedContact) {
      res.status(200).json({
        message: "success",
        data: { deletedContact },
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

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = req.body;

    const { error } = putContactSchema.validate(updatedContact);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        error: error.details[0].message,
      });
      return;
    }

    const contact = await contacts.updateContact(contactId, updatedContact);

    if (contact) {
      res.status(200).json({
        message: "success",
        data: { contact },
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
