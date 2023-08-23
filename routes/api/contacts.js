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

// router.post("/", async (req, res, next) => {
//   try {
//     const newContact = req.body;

//     if (error) {
//       res.status(400).json({
//         error: error.details[0].message,
//       });
//       return;
//     }

//     const createdContact = await contacts.addContact(newContact);

//     res.status(201).json({
//       message: "success",
//       data: { createdContact },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "error",
//       error: error.message,
//     });
//   }
// });

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
