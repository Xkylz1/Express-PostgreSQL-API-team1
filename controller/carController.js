const { Car } = require("../models");
const imagekit = require("../lib/imagekit");


async function getAllCars(req, res) {
    try {
        // logging
        // console.log("proses saat ada yang request")
        // console.log(req.requestTime)
        // console.log("proses siapa yang request")
        // console.log(req.userName)
        // console.log("proses API apa yang diminta")
        // console.log(req.originalUrl)



        const cars = await Car.findAll();

        res.status(200).json({
            status: "200",
            message: "Success get cars data",
            isSuccess: true,
            data: { cars },
        });
    } catch (error) {
        res.status(500).json({
            status: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function getCarById(req, res) {
    const id = req.params.id;
    try {
        const car = await Car.findByPk(id);

        if (!car) {
            return res.status(404).json({
                status: "404",
                message: "Car Not Found!",
            });
        }

        res.status(200).json({
            status: "200",
            message: "Success get cars data",
            isSuccess: true,
            data: { car },
        });
    } catch (error) {
        res.status(500).json({
            status: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function deleteCarById(req, res) {
    const id = req.params.id;
    try {
        const car = await Car.findByPk(id);

        if (car) {
            await car.destroy();

            res.status(200).json({
                status: "200",
                message: "Success get cars data",
                isSuccess: true,
                data: { car },
            });
        } else {
            res.status(404).json({
                status: "404",
                message: "Car Not Found!",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function updateCar(req, res) {
    const id = req.params.id;
    const { plate, model, type, year } = req.body;

    try {
        const car = await Car.findByPk(id);

        if (car) {
            car.plate = plate;
            car.model = model;
            car.type = type;
            car.year = year;

            await car.save();

            res.status(200).json({
                status: "200",
                message: "Success get cars data",
                isSuccess: true,
                data: { car },
            });
        } else {
            res.status(404).json({
                status: "404",
                message: "Car Not Found!",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "500",
            message: "Failed to get cars data",
            isSuccess: false,
            error: error.message,
        });
    }
}

async function createCar(req, res) {
    const { plate, model, type, year } = req.body;
    const files = req.files;
    let uploadedImages = [];

    try {
        if (files && files.length > 0) {
            uploadedImages = await Promise.all(
                files.map(async (file) => {
                    const ext = file.originalname.split('.').pop();
                    const uploadedImage = await imagekit.upload({
                        file: file.buffer,  // File buffer
                        fileName: `CarImage-${Date.now()}.${ext}`,
                    });

                    return uploadedImage.url;
                })
            );
        } else {
            return res.status(400).json({
                status: "Failed",
                message: "No images provided",
                isSuccess: false,
                data: null,
            });
        }

        const newCar = await Car.create({
            plate,
            model,
            type,
            year,
            images: uploadedImages,
        });

        res.status(200).json({
            status: "Success",
            message: "Car created successfully",
            isSuccess: true,
            data: { newCar },
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Failed to create car data",
            isSuccess: false,
            error: error.message,
        });
    }
}



module.exports = {
    createCar,
    getAllCars,
    getCarById,
    deleteCarById,
    updateCar,
};
