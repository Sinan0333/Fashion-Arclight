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
        required:false
    },
    images: {
      image1:{
        type:String,
        required:true
      },
      image2:{
        type:String,
        required:true
      }
      ,image3:{
        type:String,
        required:true
      }
      ,image4:{
        type:String,
        required:true
      }
    },
    description:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        required:true
    }

})


module.exports = mongoose.model("Product",productSchema)