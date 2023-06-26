const cart = require("../model/cart");
const product = require("../model/product");
const user = require("../model/userModel");
const address = require("../model/address")
// <!--================================ getCart ========================================-->

const getCartpage = async (req, res) => {
  try {
    if (req.session.user) {
      const productCount=req.session.productCount
      const userCart = await cart
        .findOne({ user: req.session.user })
        .populate("product.productId").lean()
      const isUser = await user.findOne({ _id: req.session.user }).lean()
      if (userCart){
        const cartId=userCart._id
        const data = userCart.product;
        req.session.cartProducts = data
        const userList = data.map(({ productId, quantity, price }) => ({
          _id: productId ? productId._id : null,
          name: productId ? productId.name : null,
          productImage: productId ? productId.image : null,
          quantity,
          price: quantity * (productId ? productId.price : null)
        }));
        if (!userList[0]) {
          res.render("user/emptyCart", { user: true, user1: true,isUser ,productCount});
        }
        req.session.userlist = userList
      
        const subTotal = userList.reduce((total, product) => {
          total += product.price
          return total;
        }, 0)
        req.session.totalPrice = subTotal
        await cart.updateOne({ user: req.session.user }, { $set: { totalPrice: subTotal } })
        res.render("user/cart", {
          user: true,
          user1: true, isUser,
          userList, subTotal,cartId,productCount
        });
      } else {
        res.render("user/emptyCart", { user: true, user1: true, isUser:true,productCount});
      }
    } else {
      res.redirect('/userLogin')

    }
  } catch (error) {
    console.log(error.message);
  }
};
// const getCartpage = async (req, res) => {
//   try {
//     if (req.session.user) {
//       const productCount = req.session.productCount;
//       const userCart = await cart
//         .findOne({ user: req.session.user })
//         .populate("product.productId").lean();
//       const isUser = await user.findOne({ _id: req.session.user }).lean();

//       if (userCart) {
//         const cartId = userCart._id;
//         const data = userCart.product;
//         req.session.cartProducts = data;
//         const userList = data.map(({ productId, quantity, price }) => ({
//           _id: productId ? productId._id : null,
//           name: productId ? productId.name : null,
//           productImage: productId ? productId.image : null,
//           quantity,
//           price: quantity * (productId ? productId.price : null)
//         }));
        
//         const subTotal = userList.reduce((total, product) => {
//           total += product.price
//           return total;
//         }, 0)
//         req.session.userlist = userList;
//         req.session.totalPrice = subTotal;

//         await cart.updateOne({ user: req.session.user }, { $set: { totalPrice: subTotal } });

//         res.render("user/cart", {
//           user: true,
//           user1: true,
//           isUser,
//           userList,
//           subTotal,
//           cartId,
//           productCount
//         });
//       } else {
//         res.render("user/emptyCart", {
//           user: true,
//           user1: true,
//           isUser: true,
//           productCount
//         });
//       }
//     } else {
//       res.redirect('/userLogin');
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };


// <!--=================================== Add to Cart =======================================-->

const addToCart = async (req, res) => {
  
  try {
    if (req.session.user){
      console.log(req.body.productId)
      const productDetails=await product.findOne({_id:req.body.productId})
      if(productDetails.quantity>=1){
              const userId = req.session.user;
              const productId = req.body.productId;
             const userCart = await cart.findOne({ user: userId }).lean();
              if (userCart) {
                const productExists = await userCart.product.findIndex(
                  (product) => product.productId == productId
                );
                if (productExists != -1) {
                  await cart.updateOne(
                    { user: userId, "product.productId": productId },
                    { $inc: { "product.$.quantity": 1 } }
                  );
                } else {
                  await cart.updateOne(
                    { user: userId},
                    { $push: { product: { productId: productId } } }
                  );
                  productCount=req.session.productCount;
                  console.log("productCount55:",productCount)
                  productCount=productCount+1;
                  req.session.productCount=productCount;
                }
                // await product.updateOne({_id:productId},{$inc:{quantity:-1}})         
                // res.redirect("/");
                res.json({msg:"success",productCount});

              } else {
                const product1 = await product.findOne({ _id: productId })
                const cartData = new cart({
                  user: userId,
                  product: [
                    {
                      productId: productId,
                      quantity: 1,
                      price: product1.price
                    },
                  ],
                  totalPrice: product1.price
                });
                productCount=1;
                console.log("productCount55:",productCount)
                req.session.productCount=productCount
                const cartDatas = await cartData.save();
                // await product.updateOne({_id:productId},{$inc:{quantity:-1}})
                
                res.json({msg:"success",productCount});
      }
    } else {
      res.json({msg:"failed"})
    }
  }else{
    console.log("no hello")
    res.json({msg:"failed2"})
  }
  } catch (error) {
    console.log(error.message);
  }
};

// <!--================================ quantity decrement ===================================-->

const decQuantity = async (req, res) => {
  try {
  
    const productId = req.body.id
    const userId = req.session.user
    await cart.updateOne(
      { user: userId, "product.productId": productId },
      { $inc: { "product.$.quantity": -1 } }
    );
    
    // const cartData=await cart.updateOne({user: userId,"product.productId": productId,"product.$.quantity":{$lt:1}},{$set:{"product.$.quantity":1}})
   
    const filter = {
      user: userId,
      "product.productId": productId,
      "product.quantity": { $eq: 0 }
    };
    
    const update = {
      $set: { "product.$.quantity": 1 }
    };
    
    const cartData = await cart.updateOne(filter, update);
   
    const userCart = await cart
    .findOne({ user: req.session.user })
    .populate("product.productId").lean();
      const data = userCart.product;
        
    const userList = data.map(({ productId, quantity, price }) => ({
          _id: productId._id,
          name: productId.name,
          productImage: productId.image,
          quantity,
          price: quantity * productId.price
    }));
      //  const quantity3=userList.filter((item)=>{
      //   item._id==productId && item.quantity
    // })


    // const productDetails=await cart.findOne({_id:productId},{"product.productId": productId}, {"product.quantity": { $eq: 0 }})
    // console.log("productDetails:",productDetails)
    // // console.log(productDetails.quantity)
    // if(!productDetails){
    //   await product.updateOne({_id:productId},{$inc:{quantity:1}})
    // }
   
    const subTotal = userList.reduce((total, product) => {
      total += product.price
      return total;
    }, 0)
    req.session.totalPrice = subTotal
    
    await cart.updateOne({ user: req.session.user }, { $set: { totalPrice: subTotal } })
   const index = userList.findIndex((product) => product._id.toString() === productId);
  //  if(userList[index].quantity >= 1 && setValue){
  //   if(userList[index].quantity==1){
  //     var setValue=false
  //   }
  //   // await product.updateOne({_id:productId},{$inc:{quantity:1}})
  // }
   const userCart2=userList[index].quantity
   const price1=userList[index].price
   
    res.json({userCart2,price1,subTotal})
    
  } catch (error) {
    console.log(error.message)
  }
}



// <!--================================ quantity increment ===================================-->


const incQuantity = async (req, res) => {
  try {
    const productId = req.body.id
    const userId = req.session.user
    const productDetails=await product.findOne({_id:productId}).lean();
          // const cartData=await cart.findOne({user:userId,"$product.productId":productId},{$inc:{"product.$.quantity":-1}})
    const check=req.body.check
       if(check<productDetails.quantity){
              await cart.updateOne(
                { user: userId, "product.productId": productId },
                { $inc: { "product.$.quantity": 1 } }
              );
                const userCart = await cart
                .findOne({ user: req.session.user })
                .populate("product.productId").lean();
                const data = userCart.product;
                req.session.cartProducts = data
                const userList = data.map(({ productId, quantity, price }) => ({
                      _id: productId._id,
                      name: productId.name,
                      productImage: productId.image,
                      quantity,
                      price: quantity * productId.price
                }));
              console.log("userList:",userList)
              console.log("________")
                const index = userList.findIndex((product) => product._id.toString() === productId);
              
                // if(userList[index].quantity>=productDetails.quantity){
                //   res.json({msg:"failed"})
                // }
                  
                  const userCart1=userList[index].quantity

                  const price=userList[index].price
        
                  const subTotal = userList.reduce(( total , product ) => {
                    total += product.price
                    return total;
                  }, 0)
                  req.session.totalPrice = subTotal
                  await cart.updateOne({ user: req.session.user }, { $set: { totalPrice: subTotal } })
                  res.json({userCart1,price,subTotal})
          
        }else{
            res.json({msg:"failed"})
        }

  } catch (error) {
    console.log(error.message)
  }
}
// <!--================================ delteProduct ===================================-->


const deleteProduct = async (req, res) => {
  try {
    const productId = req.body.id
    const userId = req.session.user
    await cart.updateOne(
      { user: userId },
      { $pull: { product: { productId: productId } } }
    );
    // console.log("countsession:",req.session.cartCount)
    productCount=req.session.productCount;
    console.log("productCount:",productCount)
    productCount=productCount-1;
    req.session.productCount=productCount;
    res.json({status:true,productCount})
  } catch (error) {
    console.log(error.message)
  }
}


// <!--================================ Checkout page ===================================-->

const checkout = async (req, res) => {
  try {
    const userId = req.session.user
    req.session.coupon=false;
    // req.session.paymentStatus="pending"
    const productCount=req.session.productCount
    console.log("checkout",productCount)
    const addressDetails = await address.findOne({ user: userId })
    const userDetails=await user.findOne({_id:userId}).lean()
    if (addressDetails) {
      const index = 0;
      req.session.index = index
      const addressDatas = addressDetails.address
      const addressData = addressDetails.address[0]
      req.session.address = addressData
      req.session.addressDatas = addressDatas

      // console.log(addressData)
      // const cartData=await cart.findOne({user:userId})
      const discount = 0
      req.session.discount = discount
      const totalPrice = req.session.totalPrice

      const grandTotal = totalPrice - discount
      req.session.grandTotal = grandTotal
      req.session.orginalTotal=grandTotal
      res.render('user/checkout', { user: true, user1: true, addressData, addressDatas, discount, totalPrice,isUser:true, grandTotal,userDetails,productCount})
    } else {
      res.render('user/emptyCheckout', { user: true, user1: true,isUser:true,productCount})
    }

  } catch (error) {
    console.log(error.message)
  }
}

// <!--================================ Add to cart from single product page ===================================-->

const addSingleproduct = async (req, res) => {
  try {
    const count = Number(req.body.count)
    const productId = req.query.id
    const userId = req.session.user
    const userCart = await cart.findOne({ user: userId }).lean()
    if (userCart) {
      const productExists = await userCart.product.findIndex(
        (product) => product.productId == productId
      );

      if (productExists != -1) {
        await cart.updateOne(
          { user: userId, "product.productId": productId },
          { $inc: { "product.$.quantity": count } }
        );
      } else {
        await cart.updateOne(
          { user: userId },
          { $push: { product: { $each: [{ productId: productId, quantity: count }] } } }
        );
        var productCount=req.session.productCount+1;
        req.session.productCount=productCount;
      }
      res.redirect("/cart");
    } else {
      const product1 = await product.findOne({ _id: productId })
      const cartData = new cart({
        user: userId,
        product: [
          {
            productId: productId,
            quantity: count,
          },
        ],
      });
      const cartDatas = await cartData.save();

      res.redirect("/cart");
    }
  } catch (error) {
    console.log(error.message)
  }
}


module.exports = { addToCart, getCartpage, decQuantity, incQuantity, deleteProduct, checkout, addSingleproduct };
