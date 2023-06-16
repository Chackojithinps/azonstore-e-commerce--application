const mongoose=require('mongoose')
// const { walletHistory } = require('../controllers/order')

const userSchema= mongoose.Schema({
    name:{
         type:String,
         required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    street:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    pincode:{
        type:String
    },
    city:{
        type:String
    },
    wallet:{
        type:Number,
        default:0,
        select: true 
    },
    walletHistory:[{
        date:{
            type:String
        },
        amount:{
            type:Number
        },
        msg:{
            type:String
        }
    }]
})

module.exports=mongoose.model('User',userSchema)
