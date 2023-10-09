const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  deliveryDetails: {
    type: Object,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
  },
//   userId: {
//     type: String,
//     required: true,
//   },
//   userName: {
//     type: String,
//     required: true,
//   },
  products:{
    type:Array,
    required:true
  },
  
  deliveryDate: {
    type: Date,
  },
  cancelReason: {
    type: String
  },
  returnReason: {
    type: String
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
  status: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  orderId: {
    type: String,
  },
  paymentId: {
    type: String
  }
});

module.exports = mongoose.model("order", orderSchema);