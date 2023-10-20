const mongoose = require('mongoose')


const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    offer:{
        type:Number,
        default:0
    },
    is_blocked:{
        type:Boolean,
        required:true
    },
})


module.exports = mongoose.model("Category",categorySchema)