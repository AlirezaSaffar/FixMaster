const mongoose = require('mongoose');
const { Schema } = mongoose;

const technicianSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  skills: [String], 
  rating: { type: Number, default: 0 },
  reviews: [{ 
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: String
  }],
  location: { 
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Technician = mongoose.model('Technician', technicianSchema);
module.exports = Technician;
