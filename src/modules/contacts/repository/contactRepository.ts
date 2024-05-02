import Contact from "./../../../database/models/contactsModel";

export const createNewMessage = async function (data) {
  return await Contact.create(data);
};

export const getAllMessages = async function () {
  return await Contact.find();
};

export const deleteMessageById = async function (id) {
  return await Contact.findByIdAndDelete(id);
};
