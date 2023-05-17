const address = require('../model/address')

const deliveryInfo=async (req,res)=>{
    try {
        if(req.session.user){
            const checkAddress= await address.findOne({user:req.session.user})
            if(checkAddress){
               const addressData=await address.updateOne({user:req.session.user},{$push:{address:req.body}})
            //    console.log(addressData)
               res.redirect('/checkout')
            }else{
                await address.create({user:req.session.user,address:req.body})
            //    res.render('user/checkout',{user:true,user1:true})
            // res.render('user/checkout',{user:true,user1:true,addressDatas,addressData,discount,grandTotal,totalPrice})
            res.redirect('/checkout')
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

const selectAddress=async(req,res)=>{
    try {
        
        const userId=req.session.user
        // console.log(req.body.index)
        const index=req.body.index
        req.session.index=index
        const addressDetails=await address.findOne({user:userId})
        const addressDatas=addressDetails.address
        const addressData=addressDetails.address[index]
        req.session.address=addressData
        const totalPrice=req.session.totalPrice
        const grandTotal1=totalPrice
        // req.session.grandTotal=grandTotal1
        const discount1=0
        // console.log(addressDatas)
        // console.log("_________________-")
        if(req.session.coupon){
            const discount=req.session.discount
            const grandTotal=req.session.grandTotal
            res.render('user/checkout',{user:true,user1:true,addressDatas,addressData,discount,grandTotal,totalPrice})
        }else{
            res.render('user/checkout',{user:true,user1:true,addressDatas,addressData,discount:discount1,grandTotal:grandTotal1,totalPrice})

        }

    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    deliveryInfo,
    selectAddress
}