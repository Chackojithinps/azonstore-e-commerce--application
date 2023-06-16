const order=require('../model/orders')
const user=require('../model/userModel')
const cart=require('../model/cart')
const coupon=require('../model/coupon')
const Razorpay=require('../controllers/razorpay')
const mongoose = require('mongoose');
const product=require('../model/product')

// <!--================================ user Payment method =============================================-->

const paymentMethod= async(req,res)=>{
    try {
        req.body.user=req.session.user
        req.body.products=req.session.cartProducts
        req.body.totalPrice=req.session.totalPrice
        req.body.couponCode=req.session.coupon
        req.body.discount=req.session.discount
        req.body.address=req.session.address
        req.body.grandTotal=req.session.grandTotal
        req.body.discount=req.session.discount
        req.body.paymentStatus="pending"
        req.body.status="ordered"
        req.body.date=new Date().toLocaleDateString()
        const orderData= await order.create(req.body)
        // await coupon.updateOne({code:req.session.coupon},{$inc:{couponlimit:-1}},{$push:{user:req.session.user}})
        await coupon.updateOne(
            { code: req.session.coupon },
            { $inc: { couponlimit: -1 }, $push: { user: req.session.user } }
          );
        Promise.all(orderData.products.map(({productId,quantity}) => {
            return  product.findOneAndUpdate({_id:productId},{$inc:{quantity:-quantity}})
          }))
        req.session.orderData=orderData._id
        await cart.deleteOne({user:req.body.user})
        res.json('success')
    } catch (error) {
        console.log(error.message)
    }
}

const initiatePay= async(req,res)=>{
    try {
        req.body.user=req.session.user
        req.body.products=req.session.cartProducts
        req.body.totalPrice=req.session.totalPrice
        req.body.couponCode=req.session.coupon
        req.body.discount=req.session.discount
        req.body.address=req.session.address
        req.body.grandTotal=req.session.grandTotal
        req.body.payment="online"
        req.body.paymentStatus="ordered"
        req.body.status="ordered"
        req.body.date=new Date().toLocaleDateString()

        const orderData= await order.create(req.body)
       
        await coupon.updateOne(
            { code: req.session.coupon },
            { $inc: { couponlimit: -1 }, $push: { user: req.session.user } }
          );
          Promise.all(orderData.products.map(({productId,quantity}) => {
            return  product.findOneAndUpdate({_id:productId},{$inc:{quantity:-quantity}})
          }))
        req.session.orderData=orderData._id
        razorData=await Razorpay.initiateRazorpay(orderData._id,req.session.grandTotal)
        req.session.razorData=razorData.id
        // const x=await order.updateOne({_id:orderData._id},{set:{_id:razorData.id}})
       
        // await cart.deleteOne({user:req.body.user})
        res.json({message:'success',razorData,orderData})
    }catch (error) {
        console.log(error.message)
    }
}
// const addToWallet=async(req,res)=>{
//     const isChecked=req.body.isChecked
//     console.log("HHHHHHHHHHHHHHHHHHHHHHH")
//     try {
//         const userData=await user.findOne({_id:req.session.user}).lean()
//         const walletA=userData.wallet

//         if(isChecked==true){
//             if(userData.wallet){
//                 var finalAmount=req.session.grandTotal-userData.wallet
//                 if(finalAmount<=0){
//                     finalAmount=0;
//                 }
//                 var walletBalence=userData.wallet-req.session.grandTotal
//                 if(walletBalence<=0){
//                     walletBalence=0;
//                 }
//                 walletAmount=-(req.session.grandTotal)
//                 console.log("finalAmount)
//                 console.log(walletAmount)
//                 console.log(walletBalence)
//         res.json({message:"success",finalAmount:finalAmount,walletAmount:walletAmount,walletA,walletBalence})
               
//         }
//         }else{
//          if(userData.wallet){
//             var finalAmount=req.session.grandTotal;
//             var walletBalence=walletA
//             walletAmount=0;
//             console.log(finalAmount)
//                 console.log(walletAmount)
//                 console.log(walletBalence)
//             res.json({message:"unchecked",finalAmount:finalAmount,walletAmount:walletAmount,walletA,walletBalence})

//          }
//       }
       
//     }catch(error) {
//         console.log(error.message)
//     }
// }
const walletInfo=async(req,res)=>{
    try {
        const userData=await user.findOne({_id:req.session.user}).lean()
        console.log(userData)
        console.log(1)
        if(userData.wallet && userData.wallet>=req.session.grandTotal){
                    req.body.user=req.session.user
                    req.body.products=req.session.cartProducts
                    req.body.totalPrice=req.session.totalPrice
                    req.body.couponCode=req.session.coupon
                    req.body.discount=req.session.discount
                    req.body.address=req.session.address
                    req.body.grandTotal=req.session.grandTotal
                    req.body.payment="wallet"
                    req.body.paymentStatus="success"
                    req.body.status="ordered"
                    // req.body.date = new Date().toLocaleDateString();
                    const orderData= await order.create(req.body)
                    const options = { day: "numeric", month: "numeric", year: "2-digit" };
                    const dateString1 = new Date().toLocaleDateString('en-GB', options);
                    req.body.date = dateString1

                    await coupon.updateOne(
                        { code: req.session.coupon },
                        { $inc: { couponlimit: -1 }, $push: { user: req.session.user } }
                    );
                    Promise.all(orderData.products.map(({productId,quantity}) => {
                        return  product.findOneAndUpdate({_id:productId},{$inc:{quantity:-quantity}})
                      }))
                    const subTotal=req.session.grandTotal
                    const updatedWallet=userData.wallet-req.session.grandTotal;
                    // const dateString = orderData.date// extract the date part
                    //  console.log(dateString); // prints the date string in yyyy-mm-dd format

                    // console.log("date1:",dateString)
                    const dateString=new Date().toLocaleDateString()
                    await user.updateOne(
                        { _id: req.session.user },
                        {
                          $set: { wallet: updatedWallet },
                          $push: { walletHistory: { date: dateString, amount: subTotal  } }
                        }
                      );
                    
                    req.session.orderData=orderData._id
                    await cart.deleteOne({user:req.body.user})
                    res.json({message:"success"})
        }else{
            console.log("failed")
            res.json({message:"failed"})
        }
       
     
    } catch (error) {
        console.log(error.message)
    }
}

const verifyPayment=async(req,res)=>{
    try {
      
       const userId=req.session.user
         success=await Razorpay.validate(req.body)
        const orderId=req.session.orderData
        console.log(orderId)
       
         if(success){
            
            cartData1=await order.updateOne({_id:orderId},{$set:{paymentStatus:"success"}})
            //  Promise.all(cartData.products.map(({productId,quantity}) => {
            //      return product.findOneAndUpdate({_id:productId},{$inc:{stock:-quantity}})
            //    }))
               await cart.deleteOne({user:req.session.user})
               req.session.cartNumber=0;
        //  const confirmationData=await order.findOne({_id:req.session.orderData}).populate("products.productId").lean()
        //  req.session.confirmationData=confirmationData
         res.json({message:"success"})
         }
     } catch (error) {
         console.log(error.message);
         res.render("error500")
     }
}

const orderSuccess=async(req,res)=>{
    try {
        console.log(req.session.orderData)
        const orderId=req.session.orderData
        const orderData=await order.findOne({_id:orderId}).populate('products.productId').lean()
        const products=orderData.products.map(({productId,quantity,price})=>({
            name:productId.name,
            image:productId.image,
            brand:productId.bname,
            quantity,
            price:productId.price*quantity,
        })).flat()
        console.log("products",products)
        res.render('user/orderSuccess',{user1:true,orderData,products})
    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ order Management Admin side =============================================-->

const orderManagement=async(req,res)=>{
    try {
        const orderData=await order.find().populate('products.productId').lean()
        req.session.orderData=orderData
        res.render('adminside/order',{admin:true,admin1:true,orderData})
    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ View Orders in adminside =============================================-->


const viewuserOrders=async(req,res)=>{
    try {
        const id=req.query.id
        const orderData=await order.findOne({_id:id}).populate('products.productId').lean()
        const userData=await user.find({_id:orderData.user})
        const name=userData[0].name
        const _id=userData[0].id
        const email=userData[0].email
        const phone=userData[0].phone
        const address=orderData.address
        const products=orderData.products.map(({productId,quantity,price})=>({
            name:productId.name,
            image:productId.image,
            price:productId.price,
            brand:productId.bname,
            quantity
        })).flat()
       
        res.render('adminside/viewOrders',{admin:true,admin1:true,name,_id,email,phone,address,products})
    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ delivered =============================================-->

const itemDelivered=async(req,res)=>{
    try {
        const id=req.query.id
        const orderDetails=await order.findOne({_id:id})
        console.log(orderDetails)
        if(orderDetails.status!="Cancelled"){
            await order.updateOne({_id:id},{$set:{"status":"delivered"}})
        }
       
        res.redirect('/orders')

    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ Cancelled =============================================-->

const itemCancelled=async(req,res)=>{
    try {
        const id=req.query.id
        const orderDetails=await order.findOne({_id:id})

        if(orderDetails.status!="delivered"){
            await order.updateOne({_id:id},{$set:{"status":"Cancelled"}})

        }
       
        res.redirect('/orders')

    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ Shipped =============================================-->

const itemShipped=async(req,res)=>{
    try {
        const id=req.query.id
        const orderDetails=await order.findOne({_id:id})
        if(orderDetails.status!="Cancelled" && orderDetails.status!="delivered"){
            await order.updateOne({_id:id},{$set:{"status":"Shipped"}})
        }
      
        res.redirect('/orders')

    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ Dispatched =============================================-->

const itemDispatched=async(req,res)=>{
    try {
        const id=req.query.id
        const orderDetails=await order.findOne({_id:id})
        if(orderDetails.status!="Cancelled" && orderDetails.status!="delivered"){
            await order.updateOne({_id:id},{$set:{"status":"Dispatched"}})

        }
        res.redirect('/orders')

    } catch (error) {
        console.log(error.message)
    }
}

// <!--================================ user order History =============================================-->

const userorderDetails=async(req,res)=>{
    try {
        const orderDetails = await order.find({user: req.session.user}).populate("products.productId").lean();
        console.log('orderDetails:', orderDetails);
     

        const orderData = orderDetails.map((item) => ({
            productId: item.products[0],
            _id: item._id,
            status:item.status,
            date:item.date
          }));
        console.log("orderData:",orderData)
        const productDetails = orderData.map(({productId, _id,status,date}) => ({
         
            image:productId.productId.image,
            name:productId.productId.name,
            id:_id,
            status:status,
            date:date
          }));
          const userData = await user.findOne({ _id: req.session.user }).lean()
            res.render('user/orderDetails',{user:true,user1:true,productDetails,orderDetails,userData})
    }
    

        catch (error) {
        console.log(error.message)
    }
}

 
// <!--================================ user order Management =============================================-->

const orderManage=async(req,res)=>{
    try {
    //    const orderData=req.session.orderData
    const id=req.query.id
   
    const orderData=await order.findOne({_id:id}).populate('products.productId').lean()
    // console.log(orderData)
    const userData=await user.find({_id:orderData.user})
    const products=orderData.products.map(({productId,quantity,price})=>({
        name:productId.name,
        image:productId.image,
        brand:productId.bname,
        quantity,
        price:productId.price*quantity,
    })).flat()
    console.log(products)
    // const date1 = orderData.date;

// finalDate.setDate(newDate.getDate() + 12);
const [day, month, year] = orderData.date.split('/');
const date1 = new Date(year, month - 1, day);
console.log("date1:", date1);

const date2 = new Date();
console.log("date2:", date2);

const diffTime = Math.abs(date2 - date1);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
console.log("diffInDays:", diffDays);


    if(orderData.status=="delivered" && diffDays<=12){
        var statusDelivered=true
    }
    req.session.subTotal=orderData.grandTotal
    res.render('user/orderManage',{user:true,user1:true,orderData,products,statusDelivered})

    } catch (error) {
        console.log(error.message)
    }
}
// <!--================================ user cancelling order =============================================-->

const cancelOrder=async(req,res)=>{
    try {
        const id=req.query.id
        await order.updateOne({_id:id},{$set:{"status":"Cancelled"}})
        const orderData=await order.find({user:req.session.user})
        res.redirect('/myOrder')

    } catch (error) {
        console.log(error.message)
    }
}


// const confirmReturn=async(req,res)=>{
//     try {
//         const id=req.query.id
//         const orderData=await order.findOne({_id:id})
//         await order.updateOne({_id:id},{$set:{"status":"returned"}})
//         const subTotal=req.session.subTotal
//         const result = await user.updateOne(
//             { _id: req.session.user },
//             { $inc: { wallet: subTotal } }
//           );
//         //   const date=orderData.date
//           const WalletData=await user.updateOne(
//             { _id: req.session.user },
//             { $push: { walletHistory: { date: orderData.date, amount:subTotal,msg:true } } }
//           );
//         //   console.log("WalletData:")
//         res.render('/orders')

//     } catch (error) {
//         console.log(error.message)
//     }
// }


const confirmReturn = async (req, res) => {
    try {
      const id = req.query.id;
      const orderData = await order.findOne({ _id: id }).lean()
      console.log("orderData:",orderData)
   
       const user1 = orderData.user.toString()
       console.log("user1"+user1)
      const subTotal = orderData.grandTotal;
      console.log(subTotal)
      const result = await user.updateOne(
        { _id: user1},
        { $inc: { wallet: subTotal } }
      );
      const date1=new Date().toLocaleDateString()
      const WalletData = await user.updateOne(
        {
          _id: user1
        },
        {
          $push: {
            walletHistory: {
              date: date1,
              amount: subTotal,
              msg: true
            }
          }
        }
      );
      await order.updateOne({ _id: id }, { $set: { status: "returned" } });
      Promise.all(orderData.products.map(({productId,quantity}) => {
        return  product.findOneAndUpdate({_id:productId},{$inc:{quantity:quantity}})
      }))
      res.redirect("/orders");
    } catch (error) {
      console.log(error.message);
    }
  };
  

const cancelReturn=async(req,res)=>{
    try {
        const id=req.query.id
        await order.updateOne({_id:id},{$set:{"status":"delivered"}})
        res.redirect('/orders')

    } catch (error) {
        console.log(error.message)
    }
}
const returnProduct=async(req,res)=>{
    try {
        
        const id=req.query.id
        const orderDatas=await order.findOne({_id:id}).lean()
            await order.updateOne({_id:id},{$set:{"status":"requested"}})
            req.session.return=true
        res.redirect('/myOrder')

        }
       

     catch (error) {
        console.log(error.message)
    }
}
const walletHistory=async(req,res)=>{
    try {
        const userData=await user.findOne({_id:req.session.user}).lean()
        // console.log("userDetails:",userDeta) 
        const walletData=userDta.walletHistory
        res.render('user/walletHistory',{user:true,user1:true,walletData,userData})
    } catch (error) {
        console.log(error.message)
    }
}
module.exports={
    paymentMethod,
    orderManagement,
    viewuserOrders,
    itemDelivered,
    itemCancelled,
    itemDispatched,
    itemShipped,
    userorderDetails,
    cancelOrder,
    orderManage,
    orderSuccess,
    initiatePay,
    verifyPayment,
    returnProduct,
    confirmReturn,
    cancelReturn,walletInfo,walletHistory
}