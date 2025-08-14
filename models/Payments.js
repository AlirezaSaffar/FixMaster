const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
  customer:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'offers', required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
