const mongoose=require('mongoose')

const cartSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        // required:true
    },
    product:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products',
            required:true
        },
        quantity:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
        //    require:true
        }
    }],
    totalPrice:{
        type:Number,
        // required:true
    }
}) 
module.exports = mongoose.model('cart',cartSchema)