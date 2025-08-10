const express = require("express");
const router = express.Router();
const userController = require("../controlers/usercontroler");
const authenticate = require("../middleware/authmiddleware");

router.get("/dashbord", authenticate , userController.dashbord);


module.exports = router;