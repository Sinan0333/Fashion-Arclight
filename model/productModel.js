const mongoose = require('mongoose')


const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type: String,
        required: true,
        ref: "Category",
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    offer:{
        type:String,
        ref: "Offer",
    },
    image:{
        type:Array,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        required:true
    }
    ,review: [
        {
          user: {
            type: String,
            required: true,
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
        },
      ],

})


module.exports = mongoose.model("Product",productSchema)