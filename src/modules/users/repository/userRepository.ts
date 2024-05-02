import User, { loginStatic } from "./../../../database/models/usersModel";

export const createNewUser = async function (user) {
  return await User.create(user);
};

export const getAllUsers = async function () {
  return await User.find({ role: "user" });
};

export const getOneUser = async function (id) {
  return await User.findById(id);
};

export const updateOneuser = async function (id, newBlogs) {
  return await User.findByIdAndUpdate(
    id,
    { blogs: newBlogs },
    { new: true, runValidators: true }
  );
};

export const deleteOneUser = async function (id) {
  return await User.findByIdAndDelete(id);
};

export const loginUser = async function (email, password) {
  return await loginStatic(email, password);
};
