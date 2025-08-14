const express = require("express");
const router = express.Router();
const authController = require("../controlers/authcontroler");


router.post("/login", authController.login);

router.post("/signup", authController.signup);

router.get("/technicians", authController.findtechnician)

router.get("/technician/:id", authController.getTechnicianProfile)


module.exports = router;