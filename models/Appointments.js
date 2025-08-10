const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  appointmentTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
