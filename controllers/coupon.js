const coupon=require('../model/coupon')
const cart=require('../model/cart')
const address=require('../model/address')
const user=require('../model/userModel')
// <!--================================ getCoupon Adminside=============================================-->
const getCoupon=async(req,res)=>{
    try {
        const coupon1=await coupon.find().lean()
        
        const couponData = coupon1.map((coup)=>{
            const date = new Date(coup.expiryDate)
            const expiryDate = date.toLocaleString()
            const id = coup._id
            const minamount = coup.minamount
            const maxamount = coup.maxamount
            
            const discount = coup.discount
            const code = coup.code 
            const name = coup.name 
            return{expiryDate,id,name,code,discount,maxamount,minamount}
        })
        console.log(couponData)
        res.render('adminside/couponPage',{admin:true,admin1:true,couponData})
    } catch (error) {
        console.log(error.message)
    }
}

// name
// "NEWYEAROFFER"
// code
// "NYR200"
// discount
// 5
// minamount
// 500
// maxamount
// 600
// expiryDate
// 2023-05-30T00:00:00.000+00:00

// user
// Array
// couponlimit
// 5
// <!--================================ Add Coupon Adminside =============================================-->

const getAddCoupon=async(req,res)=>{
    try {
        res.render('adminside/addCoupon',{admin:true,admin1:true})
    } catch (error) {
        console.log(error.message)
    }
}

const postAddCoupon=async(req,res)=>{
    try {
        // console.log(req.body)
       const couponData=await coupon.findOne({code:req.body.code})
       if(couponData){
        //    res.render()
       }else{
         const couponDatas=await coupon.create(req.body)
         console.log(couponDatas)
         res.redirect('/coupon')
       }
    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ User coupon Apply =============================================-->

const couponSubmit=async(req,res)=>{
    try{
        const userCoupon=req.body.couponCode   
        const userId=req.session.user   
        const discount2=0
        const totalPrice=req.session.totalPrice
        const grandTotal=req.session.grandTotal
        const addressDetails=await address.findOne({user:userId})
        const addressDatas=addressDetails.address
        const addressData=addressDetails.address[req.session.index]
        const userDetails=await user.findOne({_id:req.session.user}).lean()

        const isCoupon=await coupon.findOne({code:userCoupon})
        if(isCoupon){
            var isuserExists = isCoupon.user.indexOf(userId)
            var limit=isCoupon.couponlimit
        }
        // console.log(isuserExists)
        if(isCoupon && isuserExists==-1 && limit>0){
            
        
            if(grandTotal>isCoupon.minamount){
                const CurrentDate=new Date()
                if(CurrentDate<isCoupon.expiryDate){
                    req.session.coupon=isCoupon.code
                    const totaldiscount=isCoupon.discount
                    var discount1=Math.floor((totaldiscount / 100) * totalPrice);
                    if(discount1>isCoupon.maxamount){
                        discount1=isCoupon.maxamount
                    }
                    const grandTotal1=totalPrice-discount1
                    req.session.discount=discount1
                    req.session.grandTotal=grandTotal1
                    res.render('user/checkout',{user:true,user1:true,addressDatas,addressData,totalPrice,discount:discount1,userDetails,grandTotal:grandTotal1,msg1:"coupon addedd successfully"})
                }else{
                res.render('user/checkout',{user:true,user1:true,totalPrice,addressDatas,addressData,discount:discount2,userDetails,grandTotal,msg:"coupon expired"})
                }
            }else{
                res.render('user/checkout',{user:true,user1:true,totalPrice,addressDatas,addressData,discount:discount2,userDetails,grandTotal,msg:"you should meet minimum amount"})

            }
           
     
        }else{
            req.session.discount=0
            const discount2=req.session.discount
            res.render('user/checkout',{user:true,user1:true,totalPrice,addressDatas,addressData,discount:discount2,userDetails,grandTotal,msg:"invalid coupon"})
        }
    }catch (error) {
        console.log(error.message)
    }
}


module.exports={
    getCoupon,
    getAddCoupon,
    postAddCoupon,
    couponSubmit
}