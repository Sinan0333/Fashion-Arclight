const express = require('express')
const admin_route = express()
const session = require('express-session')


// =========================================< Controllers >=================================================
const adminControllers=require('../controller/adminControllers')
const productControllers=require('../controller/productControllers')
const categoryControllers = require('../controller/categoryControllers')
const orderControllers=require('../controller/orderControllers')
const bannerControllers=require('../controller/bannerControllers')
const couponControllers=require('../controller/couponControllers')
const offerControllers=require('../controller/offerControlllers')


const config = require('../config/mongodb')
const auth = require('../middleware/adminAuth')
const multer = require('../middleware/multer')


admin_route.set('views','./views/admin')


// =========================================< MiddleWare >=================================================
admin_route.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized:true
}))


// =========================================< Login logout  >=================================================
admin_route.get('/login',auth.isLogout,adminControllers.loadlogin)
admin_route.post('/login',adminControllers.verifyLogin)
admin_route.get('/logout',adminControllers.adminLogout)


// =========================================< Dashboard  >=================================================
admin_route.get('/',auth.isLogin,adminControllers.loadDashboard)


// =========================================< User Management  >=================================================
admin_route.get('/user',auth.isLogin,adminControllers.loadUserManagement)
admin_route.post('/blockUser',auth.isLogin,adminControllers.blockUser)


// =========================================< Category Management  >=================================================
admin_route.get('/category',auth.isLogin,categoryControllers.loadCategoryManagement)
admin_route.post('/addCategory',categoryControllers.addCategory)
admin_route.get('/blockCategory',auth.isLogin,categoryControllers.blockCategory)
admin_route.post('/updateCategory',categoryControllers.updateCategory)


// =========================================< Product Management  >=================================================
admin_route.get('/product',auth.isLogin,productControllers.loadProductManagement)
admin_route.get('/addproduct',auth.isLogin,productControllers.loadAddProduct)
admin_route.post('/addProduct',multer.uploadProduct,productControllers.addProduct)
admin_route.get('/blockProduct',auth.isLogin,productControllers.blockProduct)
admin_route.get('/editProduct',auth.isLogin,productControllers.loadEditProduct)
admin_route.post('/editProduct',multer.uploadProduct,productControllers.editProduct)
admin_route.get('/deleteProduct',productControllers.deleteProduct)


// =========================================< Order Management  >=================================================
admin_route.get('/order',auth.isLogin,orderControllers.loadOrderManagement)
admin_route.get('/orderSummary',auth.isLogin,orderControllers.loadOrderSummary)
admin_route.post('/updateOrder',orderControllers.updateOrder)


// =========================================< Banner Management  >=================================================
admin_route.get('/banner',auth.isLogin,bannerControllers.loadBannerManagement)
admin_route.get('/addBanner',auth.isLogin,bannerControllers.loadAddBanner)
admin_route.post('/addBanner',multer.banner.single('image'),bannerControllers.addBanner)
admin_route.post('/deleteBanner',bannerControllers.deleteBanner)
admin_route.post('/blockBanner',bannerControllers.blockBanner)
admin_route.get('/editBanner',bannerControllers.loadEditBanner)
admin_route.post('/editBanner',multer.banner.single('image'),bannerControllers.editBanner)


// =========================================< Coupon Management  >=================================================
admin_route.get('/coupon',auth.isLogin,couponControllers.loadCouponManagement)
admin_route.get('/addCoupon',auth.isLogin,couponControllers.loadAddCoupon)
admin_route.post('/addCoupon',couponControllers.addCoupon)
admin_route.get('/editCoupon',auth.isLogin,couponControllers.loadEditCoupon)
admin_route.post('/editCoupon',couponControllers.editCoupon)
admin_route.post('/blockCoupon',couponControllers.blockCoupon)
admin_route.post('/deleteCoupon',couponControllers.deleteCoupon)


// =========================================< Offer Management  >=================================================
admin_route.get('/offer',auth.isLogin,offerControllers.loadOfferrManagement)
admin_route.get('/addOffer',auth.isLogin,offerControllers.loadAddOffer)
admin_route.post('/addOffer',offerControllers.addOffer)
admin_route.get('/editOffer',auth.isLogin,offerControllers.loadEditOffer)
admin_route.post('/editOffer',offerControllers.editOffer)
admin_route.post('/blockOffer',offerControllers.blockOffer)
admin_route.post('/deleteOffer',offerControllers.deleteOffer)


// =========================================< Sales Report  >=================================================
admin_route.get('/salesReport',adminControllers.salesReport)
admin_route.get('/reportDown',adminControllers.downloadReport)

module.exports = admin_route