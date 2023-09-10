const express = require("express");
const router = express.Router();

const contacts = require("../../models/contacts");

const paginatedResults = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = array.slice(startIndex, endIndex);
  return results;
};

router.get("/", async (req, res, next) => {
  try {
    const contactsList = await contacts.listContacts();

    const { page = 1, limit = 20 } = req.query;
    let filteredContacts = contactsList.filter(
      (favorite) => favorite.favorite === true
    );

    const paginatedContacts = paginatedResults(filteredContacts, page, limit);

    const totalContacts = filteredContacts.length;
    const totalPages = Math.ceil(totalContacts / limit);

    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        contacts: paginatedContacts,
        totalContacts: totalContacts,
        totalPages: totalPages,
        contactsPerPage_True: limit,
      },
    });
  } catch (error) {
    res.status(500).json(`Contacts download error - ${error}`);
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
  const { name, email, phone, favorite } = req.body;

  if (Object.keys({ name, email, phone, favorite }).length === 0) {
    return res
      .status(400)
      .json("Error! Missing fields! Empty request is not allowed");
  }

  try {
    const contact = await contacts.addContact({ name, email, phone, favorite });

    return res.status(201).json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (error) {
    res
      .status(500)
      .json(`An error occurred while adding the contact: ${error}`);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;

  if (Object.keys({ name, email, phone, favorite }).length === 0) {
    return res
      .status(400)
      .json("Error! Missing fields! Empty request is not allowed");
  }

  try {
    const updatedContact = await contacts.updateContact(contactId, {
      name,
      email,
      phone,
      favorite,
    });

    return res.json({
      status: "success",
      code: 200,
      data: { updatedContact },
    });
  } catch (error) {
    res
      .status(500)
      .json(`An error occurred while updating the contact: ${error}`);
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

module.exports = router;
