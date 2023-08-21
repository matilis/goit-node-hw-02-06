const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.resolve("./models/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.error(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contact = contacts.find((item) => item.id === contactId);
    console.table(contact);
    return contact;
  } catch (error) {
    console.error(error);
  }
}

async function addContact(contact) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const newContact = {
      id: uuidv4(),
      ...contact,
    };

    fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact]));
    console.table(newContact);
    return newContact;
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const newContacts = contacts.filter((item) => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    console.table(newContacts);
    return contacts;
  } catch (error) {
    console.error(error);
  }
}

async function updateContact(contactId, updatedContactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const index = contacts.findIndex((item) => item.id === contactId);

    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updatedContactId };
      await fs.writeFile(contactsPath, JSON.stringify(contacts));
      console.table(contacts[index]);
      return contacts[index];
    } else {
      throw new Error("Contact not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
