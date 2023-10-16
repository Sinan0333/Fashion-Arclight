const mongoose = require('mongoose')


const bannerSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    is_blocked:{
        type:Boolean,
        required:true
    },
})


module.exports = mongoose.model("Banner",bannerSchema)