const mongoose=require('mongoose')

const categorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
}) 
module.exports = mongoose.model('category',categorySchema)