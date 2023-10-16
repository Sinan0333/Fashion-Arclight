const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
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
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);