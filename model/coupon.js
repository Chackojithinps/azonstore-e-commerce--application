const mongoose=require('mongoose')
const couponSchema=mongoose.Schema({
    name:{
        type:String,
    },
    code:{
        type:String
    },
    discount:{
        type:Number
    },
    minamount:{
        type:Number
    },
    maxamount:{
        type:Number
    },
    expiryDate:{
        type:Date
    },
    user:{
        type:Array
    },
    couponlimit:{
        type:Number
    }
})
module.exports = mongoose.model('coupon',couponSchema)