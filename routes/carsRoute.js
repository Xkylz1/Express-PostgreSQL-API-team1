const express = require("express");
const router = express.Router();
const upload=require("../middlewares/uploader")

const carController = require("../controller/carController");

router.post("/", upload.array('images', 10), carController.createCar);
router.get("/", carController.getAllCars);
router.get("/:id", carController.getCarById);
router.delete("/:id", carController.deleteCarById);
router.patch("/:id", carController.updateCar);

module.exports = router;
