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
  couponDiscount: {
    type: Number,
    default:0,
  },
  shippingMethod: {
    type: String,
    default:"free-shipping",
  },
  shippingAmount: {
    type: Number,
    default:0,
  }
});

module.exports = mongoose.model("Cart", cartSchema);