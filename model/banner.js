const mongoose=require('mongoose')

const bannerSchema=mongoose.Schema({
    header:{
        type:String
    },
    image:{
        type:String
    },
    type:{
        type:String
    },
    description:{
        type:String
    },
    highlight:{
        type:String
    }
    
}) 
module.exports = mongoose.model('banner',bannerSchema)