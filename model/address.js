const  mongoose = require("mongoose")
const addressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // required:true
    },
    address:{
        type:Array,
        required:true
    }
})
module.exports = mongoose.model('address',addressSchema)