

// const express = require('express')
// const mongoose = require('mongoose')
// const AdminJS = require('adminjs');
// const AdminJSExpress = require('@adminjs/express');
// const AdminJSMongoose = require('@adminjs/mongoose');
// const User = require('../models/Users');
// const Request = require('../models/Requests');

// const router = express.Router();

// AdminJS.registerAdapter(AdminJSMongoose);

// const adminJs = new AdminJS({
//   resources: [User, Request /* , other models */],
//   rootPath: '/admin',
// });

// const adminRouter = AdminJSExpress.buildRouter(adminJs);

// module.exports = adminRouter;
const express = require('express');
const router = express.Router();
const adminControler = require('../controlers/admincontroler')



router.get('/', adminControler.getinfo);

router.get("/setlimit",adminControler.setlimit)

module.exports = router;
