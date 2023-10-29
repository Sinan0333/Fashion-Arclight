const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId:{
   type:String,
   required:true,
   ref:'Product'
  },
  
  review: [
    {
      user: {
        type:String,
        ref: "User",
      },
      rating: {
        type: Number,
        required:true
      },
      comment: {
        type: String,
        required: true,
      },
      likes: {
        type: Array,
        required: true,
      },
      replay:[
        {
          user:{
            type:String,
            ref:"User"
          },
          comment: {
            type: String,
            required: true,
          }
        }
      ]
    },
  ],
  
});

module.exports = mongoose.model("Review", reviewSchema);