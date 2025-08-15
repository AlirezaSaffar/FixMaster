const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminSchema = new Schema({

    limit: { type: Number, required: true , default:0},
 
})

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
