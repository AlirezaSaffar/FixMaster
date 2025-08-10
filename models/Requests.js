const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestSchema = new Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  images: [String], // URLs of the uploaded images
  location: { 
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  status: { 
    type: String, 
    enum: ['pending', 'under_review', 'in_progress', 'completed'], 
    default: 'pending' 
  },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Technician assigned to the task
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
