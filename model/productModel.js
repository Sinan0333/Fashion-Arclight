const mongoose = require('mongoose')


const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
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

})


module.exports = mongoose.model("Product",productSchema)