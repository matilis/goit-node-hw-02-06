const Contact = require("../service/schemas/contact");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.log("Error getting contact list: ", error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    return await Contact.findOne({ _id: contactId });
  } catch (error) {
    console.log(`Error getting contact with id ${contactId}: `, error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId });
  } catch (error) {
    console.log(`Error removing contact with id ${contactId}: `, error);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    return await Contact.create(body);
  } catch (error) {
    console.log("Error adding new contact: ", error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate({ _id: contactId }, body, {
      new: true,
    });
  } catch (error) {
    console.error("An Error occurred while updating contact: ", error);
    throw error;
  }
};

const updatedStatusContact = async (contactId, favorite) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId },
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
