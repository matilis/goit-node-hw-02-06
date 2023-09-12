const Contact = require("../service/schemas/contact");

const listContacts = async (userId) => {
  try {
    return await Contact.find({ owner: userId });
  } catch (error) {
    console.log("Error getting contact list: ", error);
    throw error;
  }
};

const getContactById = async (contactId, userId) => {
  try {
    return await Contact.findOne({ _id: contactId, owner: userId });
  } catch (error) {
    console.log(`Error getting contact with id ${contactId}: `, error);
    throw error;
  }
};

const removeContact = async (contactId, userId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId, owner: userId });
  } catch (error) {
    console.log(`Error removing contact with id ${contactId}: `, error);
    throw error;
  }
};

const addContact = async (body, userId) => {
  try {
    const newContact = new Contact({ ...body, owner: userId });
    return await newContact.save();
  } catch (error) {
    console.log("Error adding new contact: ", error);
    throw error;
  }
};

const updateContact = async (contactId, body, userId) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      body,
      {
        new: true,
      }
    );
  } catch (error) {
    console.error("An Error occurred while updating contact: ", error);
    throw error;
  }
};

const updatedStatusContact = async (contactId, favorite, userId) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
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
