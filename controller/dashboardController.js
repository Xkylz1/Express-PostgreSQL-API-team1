const { User } = require("../models");

async function userPage(req, res) {
  try {
    const users = await User.findAll();

    res.render("users/index", {
      users
    });
  } catch (error) {
    // res.render("error", {
    //   message: error.message,
    // });
  }
}

async function createPage(req, res) {
  try {
    // const users = await User.findAll();

    res.render("users/create.ejs", {
      users
    });
  } catch (error) {
    // res.render("error", {
    //   message: error.message,
    // });
  }
}
async function createUser(req, res) {
  const file = req.file;
  console.log(req.file);

  
  // process file
  const split = file.originalname.split(".");
  const ext = split[split.length - 1];
  // upload image ke server
  const uploadedImage = await imagekit.upload({
    file: file.buffer,
    fileName: `Profile-${Date.now()}.${ext}`,
  });

  console.log(uploadedImage);
  if (!uploadedImage) {
    return res.status(400).json({
      status: "Failed",
      message: "Failed to add user data",
      isSuccess: false,
      data: null,
    });
  }

  const newUser = req.body;

  try {
    await User.create({ ...newUser,photoProfile: uploadedImage.url });

    res.status(200).json({
      status: "Success",
      message: "Successfully added user data",
      isSuccess: true,
      data: { ...newUser, photoProfile: uploadedImage.url },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to add user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}
// async function getDriverById(req, res) {
//   const id = req.params.id;
//   try {
//     const driver = await Driver.findByPk(id);

//     if (!driver) {
//       return res.status(404).json({
//         status: "404",
//         message: "Driver Not Found!",
//       });
//     }

//     res.status(200).json({
//       status: "200",
//       message: "Success get drivers data",
//       isSuccess: true,
//       data: driver,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "500",
//       message: "Failed to get drivers data",
//       isSuccess: false,
//     });
//   }
// }
// async function deleteDriverById(req, res) {
//   const id = req.params.id;
//   try {
//     const driver = await Driver.findByPk(id);

//     if (driver) {
//       await driver.destroy();

//       res.status(200).json({
//         status: "200",
//         message: "Success get drivers data",
//         isSuccess: true,
//         data: driver,
//       });
//     } else {
//       res.status(200).json({
//         status: "204",
//         message: "Success delete drivers data",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: "500",
//       message: "Failed to get cars data",
//       isSuccess: false,
//       error: error.message,
//       data: null,
//     });
//   }
// }

module.exports = {
  userPage,
  createPage
  // getDriverById,
  // deleteDriverById,
};
