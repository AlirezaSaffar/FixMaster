const express = require("express");
const router = express.Router();
const userController = require("../controlers/usercontroler");
const authenticate = require("../middleware/authmiddleware");
const customerauthenticate = require("../middleware/customermiddleware")
const technicianauthenticate = require("../middleware/technicianmiddleware")

router.get("/dashbord", authenticate , userController.dashbord);

router.get("/myrequests" ,customerauthenticate,userController.getmyrequests)

router.get("/requests" ,technicianauthenticate,userController.getrequests)

router.post("/offer/:id" , technicianauthenticate , userController.setoffer )

router.get("/request/:requestId", customerauthenticate , userController.getrequestdetails)

router.get("/request/:requestId/offers", customerauthenticate , userController.getrequestoffers)

router.post("/accept-offer" , customerauthenticate ,  userController.setappointment)

router.get("/appointments", authenticate, userController.getappointments )

router.post("/complete-appointment", customerauthenticate , userController.addreview )



module.exports = router;