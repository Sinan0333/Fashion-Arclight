const mongoose = require('mongoose')


const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        required:true
    },
})


module.exports = mongoose.model("Category",categorySchema)