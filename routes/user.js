const express = require("express");
const router = express();
const userController = require("../controllers/user");
const cartController=require('../controllers/cart');
const addressController=require('../controllers/address')
const auth=require('../middleware/auth')
const couponController=require('../controllers/coupon')
const orderController=require('../controllers/order')
const productController=require('../controllers/products')

router.get("/", userController.getHomepage);
router.get("/cart", cartController.getCartpage);
router.patch('/minus',cartController.decQuantity)
router.patch('/plus',cartController.incQuantity)
router.get("/userLogin",auth.isLogout,userController.userLogin);
router.get("/userSignup",auth.isLogout, userController.userSignup);
router.get("/singleProduct", userController.singleProduct);
router.post("/userSignup", userController.postUserSignup);
router.post("/userLogin", userController.postUserSignin);
router.get("/userOtp",userController.getOtp);
router.post("/verifyOtp", userController.postOtpVerification);
router.get('/signout',userController.userSignout)
router.get('/userProfile',userController.getUserProfile)
router.get('/editProfile',userController.geteditProfile)
router.post('/editProfile',userController.posteditProfile)
router.post("/addToCart",cartController.addToCart);
router.get('/shop',userController.shop)
router.patch('/deleteCartproduct',cartController.deleteProduct)
router.get('/checkout',cartController.checkout)
router.post('/deliveryInfo',addressController.deliveryInfo)
router.post('/selectAddress',addressController.selectAddress)
router.post('/couponsubmit',couponController.couponSubmit)
router.get('/resendotp',userController.resendOtp)
router.post('/paymentInfo',orderController.paymentMethod)
router.post('/initiaterazorpay',orderController.initiatePay)
router.post("/verifyRazorpay",orderController.verifyPayment)
router.get('/orderSuccess',orderController.orderSuccess)
router.get('/myOrder',orderController.userorderDetails)
router.get('/cancelOrder',orderController.cancelOrder)
router.get('/orderManage',orderController.orderManage)
router.get('/forgotPassword',userController.forgotPassword)
router.post('/forgotPassemail',userController.forgotPassemail)
router.post('/verifyOtp2',userController.postOtpVerificationPass)
router.get('/resendotpkk',userController.resendOtpkk)
router.get('/getotpPage2',userController.getotpPage2)
router.post('/passwordSubmit',userController.passwordSubmit)
router.get('/addressBook',userController.getaddressBook)
router.get('/addprofileAddress',userController.addprofileAddress)
router.post('/addNewaddress',userController.addNewaddress)
router.get('/editprofileAddress',userController.editprofileAddress)
router.post('/updateProfileaddress',userController.updateProfileaddress)
// router.get('/addprofileAddress',userController.addprofileAddress)
router.get('/categorySort',userController.findProductsByCategory)
router.get('/allProducts',userController.findAllProducts)
router.post('/addSingleproduct',cartController.addSingleproduct)
// router.post('/search',productController.searchProduct)
// router.get('/categorySort1',productController.findProductsByCategory)
// router.get('/shopfilter',productController.filterShopProducts)
router.get('/returnProduct',orderController.returnProduct)
router.post('/walletInfo',orderController.walletInfo)
router.get('/walletHistory',orderController.walletHistory)

module.exports = router;
