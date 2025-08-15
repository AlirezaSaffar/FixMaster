const { bool } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestSchema = new Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  images: [String], 
  location: String,  
  service: { 
    type: String, 
    enum: ['plumbing', 'electrical', 'cleaning', 'carpentry', 'none'], 
    default: 'none' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  },
  offers: [{
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  warranty :{type:Boolean},

});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
