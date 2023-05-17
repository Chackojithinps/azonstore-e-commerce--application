const express=require('express')
const router=express()
const adminController=require('../controllers/admin')
const productController=require('../controllers/products')
const categoryController=require('../controllers/category')
const couponController=require('../controllers/coupon')
const orderController=require('../controllers/order')
const bannerController=require('../controllers/banner')
const adminauth=require('../middleware/adminauth')

const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImages'))
    },
    filename:function(req,file,cb){
        const name=Date.now() + '-' + file.originalname;
        cb(null,name)
    }
})
const upload=multer({storage:storage})

// Dashboard and userManagement
router.get('/admin',adminauth.isadminLogout,adminController.adminLogin)
router.get('/adminDashboard',adminauth.isadminLogin,adminController.adminDashboard)
router.get('/userList',adminauth.isadminLogin,adminController.userManangement)
router.post('/adminLogin',adminController.postAdminLogin)
router.get('/blockUser',adminauth.isadminLogin,adminController.blockUser)
router.get('/unblockUser',adminauth.isadminLogin,adminController.unblockUser)
router.get('/adminLogout',adminController.adminLogout)
//category
router.get('/category',adminauth.isadminLogin,categoryController.getCategory)
router.post('/addCategory',categoryController.insertCategory)
router.get('/list',adminauth.isadminLogin,categoryController.listCategory)
router.get('/unlist',adminauth.isadminLogin,categoryController.unlistCategory)
router.get('/editCategory',categoryController.editCategory)
router.post('/editCategory',categoryController.posteditCategory)

//products
router.get('/products',adminauth.isadminLogin,productController.productLists)
router.get('/addProducts',adminauth.isadminLogin,productController.addProducts)
router.post('/addProduct',upload.array('image',4),productController.postAddProduct)
router.get('/editProduct',adminauth.isadminLogin,productController.editProduct)
router.post('/editProduct',upload.array('image',4),productController.postEditProduct)
router.get('/deleteProductImage',productController.deleteProductImage)
router.get('/delProduct',productController.softDeleteproduct)
router.get('/showProduct',productController.showProduct)

router.get('/coupon',couponController.getCoupon)
router.get('/addCoupon',couponController.getAddCoupon)
router.post('/addCoupon',couponController.postAddCoupon)

router.get('/orders',orderController.orderManagement)
router.get('/viewuserOrders',orderController.viewuserOrders)
router.get('/itemDelivered',orderController.itemDelivered)
router.get('/itemCancelled',orderController.itemCancelled)
router.get('/itemDispatched',orderController.itemDispatched)
router.get('/itemShipped',orderController.itemShipped)
router.get('/confirmReturn',orderController.confirmReturn)
router.get('/cancelReturn',orderController.cancelReturn)
// router.get('/adminSignup',adminController.adminSignup)
// router.post('/adminSignup',adminController.postAdminSignup)

router.get('/banner',bannerController.bannerManagement)
router.get('/addBanner',bannerController.addBanner)
router.post('/addBanner',upload.single('image'),bannerController.postaddBanner)

module.exports=router