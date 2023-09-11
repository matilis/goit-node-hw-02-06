const Contact = require("../service/schemas/contact");

const listContacts = async (owner) => {
  try {
    return await Contact.find({ owner });
  } catch (error) {
    console.log("Error getting contact list: ", error);
    throw error;
  }
};

const getContactById = async (contactId, owner) => {
  try {
    return await Contact.findOne({ _id: contactId, owner });
  } catch (error) {
    console.log(`Error getting contact with id ${contactId}: `, error);
    throw error;
  }
};

const removeContact = async (contactId, owner) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId, owner });
  } catch (error) {
    console.log(`Error removing contact with id ${contactId}: `, error);
    throw error;
  }
};

const addContact = async (body, owner) => {
  try {
    const contact = { body, owner };
    return await Contact.create(contact);
  } catch (error) {
    console.log("Error adding new contact: ", error);
    throw error;
  }
};

const updateContact = async (contactId, body, owner) => {
  try {
    return await Contact.findByIdAndUpdate({ _id: contactId, owner }, body, {
      new: true,
    });
  } catch (error) {
    console.error("An Error occurred while updating contact: ", error);
    throw error;
  }
};

const updatedStatusContact = async (contactId, favorite, owner) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId, owner },
      { $set: { favorite: favorite } },
      { new: true }
    );
  } catch (error) {
    console.error("An Error occurred while updating contact: ", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updatedStatusContact,
};
