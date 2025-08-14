const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  customer:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed'], 
    default: 'scheduled' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
