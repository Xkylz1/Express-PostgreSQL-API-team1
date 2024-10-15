const { User } = require("../models");
const imagekit = require("../lib/imagekit");

// Function for get all user data to render in page

async function userPage(req, res) {
  try {
    const users = await User.findAll();
    console.log(users.data);
    res.render("users/index", {
      title: "User Page",
      users,
    });
  } catch (error) {
    res.render("error", {
      message: error.message,
    });
  }
}

async function createUser(req, res) {
  console.log(req.body);
  const newUser = req.body;

  const file = req.file;
  console.log(file);
  // processing file nya

  // 1. split utk dpt extension dan file name
  const split = file.originalname.split(".");
  // imam.pdf = ['imam', 'pdf'] = length 2
  const ext = split[split.length - 1];
  const filename = split[0];

  // 2. upload image ke server
  const uploadedImage = await imagekit.upload({
    file: file.buffer,
    fileName: `Profile-${filename}-${Date.now()}.${ext}`,
  });
  await User.create({ ...newUser, photoProfile: uploadedImage.url });
  res.redirect("/dashboard/admin/users");
  console.log(uploadedImage);
  try {
    await User.create({ ...newUser });
    res.redirect("/dashboard/admin/users");
  } catch (error) {
    res.redirect("/error");
  }
}

async function createPage(req, res) {
  try {
    res.render("users/create", {
      title: "Create Page",
    });
  } catch (error) {
    res.render("error", {
      message: error.message,
    });
  }
}

// Function for get user data by id
async function getUserById(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Can't find spesific id user",
        isSuccess: false,
        data: null,
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Successfully obtained user data",
      isSuccess: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to get user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

// Function for delete user by id
async function deleteUserById(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Can't find spesific id user",
        isSuccess: false,
        data: null,
      });
    }

    await user.destroy();

    res.status(200).json({
      status: "Success",
      message: "Successfully delete user data",
      isSuccess: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to delete user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

// Function for update user by id
async function UpdateUserById(req, res) {
  const { firstName, lastName, age, phoneNumber } = req.body;
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Can't find spesific id user",
        isSuccess: false,
        data: null,
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      status: "Success",
      message: "Successfully update user data",
      isSuccess: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to update user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

module.exports = {
  userPage,
  createPage,
  getUserById,
  deleteUserById,
  UpdateUserById,
  createUser,
};
