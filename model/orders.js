const mongoose=require('mongoose')

const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products',
        },
        quantity:{
            type:Number,      
        },
        price:{
            type:Number
        }
    }],
    totalPrice:{
        type:Number
    },
    discount:{
        type:Number
    },
    grandTotal:{
        type:Number
    },
    payment:{
        type:String
    },
    totalAmount:{
        type:Number
    },
    status:{
        type:String
    },
    address:{
        type:Object
    },
    paymentStatus:{
        type:String
    },
   
    date:{
        type:String
    }
  
    

}
    
) 
module.exports = mongoose.model('order',orderSchema)