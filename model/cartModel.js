const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    ref: "users",
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
        ref: "Product",
      },
      count: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
    },
  ],
  cartTotal: {
    type: Number,
    default:0,
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);