const express = require("express");
const router = express.Router();

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

    if (error) {
      res.status(400).json({
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

    if (error) {
      res.status(400).json({
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

router.patch("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const contact = await contacts.updateContact(contactId, { favorite });

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
