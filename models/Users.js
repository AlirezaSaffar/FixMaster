const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'technician'], required: true },
  city: { type: String },  
  service: { type: String, enum: ['plumbing', 'electrical', 'cleaning', 'carpentry','none'] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;
