import Subscribe from "./../../../database/models/subscribeModel";

export const getAllSubscribers = async function () {
  return await Subscribe.find();
};

export const createNewSubscriber = async function (data) {
  return await Subscribe.create(data);
};

export const deleteSubscriberById = async function (id) {
  return await Subscribe.findByIdAndDelete(id);
};
