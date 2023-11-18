const express = require('express')
const user_route = express()
const session = require('express-session')


// =========================================< Controllers >=================================================
const userControllers=require('../controller/userControllers')
const productControllers=require('../controller/productControllers')
const addressControllers=require('../controller/addressControllers')
const cartControllers=require('../controller/cartControllers')
const orderControllers=require('../controller/orderControllers')
const wishlistControllers=require('../controller/wishlistControllers')
const couponControllers=require('../controller/couponControllers')
const reviewControllers=require('../controller/reviewControllers')

const config = require('../config/mongodb')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')
require("dotenv").config()


user_route.set('views','./views/user')


// =========================================< MiddleWares>=================================================
user_route.use(session({
    secret:process.env.sessionSecret,
    resave: false,
    saveUninitialized:true
}))


// =========================================< Login Logout >=================================================
user_route.get('/login',auth.isLogout,userControllers.loadlogin)
user_route.post('/login',userControllers.verifyLogin)
user_route.get('/logout',auth.isLogin,userControllers.userLogout)


// =========================================< Signup verification forgotPassword  >=================================================
user_route.get('/signUp',auth.isLogout,userControllers.loadRegister)
user_route.post('/signUp',multer.user.single('img'),userControllers.insertUser)
user_route.post('/validate',userControllers.otpVarification)
user_route.get('/resend',auth.isLogout,userControllers.resendOtp)
user_route.get('/forgotPassword',userControllers.forgotPassword)
user_route.post('/getEmail',auth.isLogout,userControllers.getEmail)
user_route.post('/changePassword',userControllers.changePassword)


// =========================================< Header buttons >=================================================
user_route.get('/',productControllers.loadHome)
user_route.get('/shop',productControllers.loadShop)
user_route.get('/aboutUS',userControllers.loadAboutUs)
user_route.get('/contactUs',userControllers.loadContactUs)


// =========================================< Search,Filter,Product Datails >=================================================
user_route.get('/product',productControllers.loadProduct)
user_route.get('/filter',productControllers.productFilter)


// =========================================< Profile >=================================================
user_route.get('/profile',auth.isLogin,userControllers.loadprofile)
user_route.get('/editProfile',auth.isLogin,userControllers.loadEditProfile)
user_route.post('/editProfile',multer.user.single('img'),userControllers.editProfile)


// =========================================< Address >=================================================
user_route.get('/addAddress',auth.isLogin,addressControllers.loadAddAddress)
user_route.post('/addAddress',addressControllers.addAddress)
user_route.get('/editAddress',auth.isLogin,addressControllers.loadEditAddress)
user_route.post('/editAddress',addressControllers.editAddress)
user_route.post('/deleteAddress',addressControllers.deleteAddress)


// =========================================< Cart >=================================================
user_route.post('/addToCart',auth.isLogin,cartControllers.addToCart)
user_route.get('/cart',auth.isLogin,cartControllers.loadCart)
user_route.post('/updateCart',cartControllers.updateCart)
user_route.post('/removeProduct',cartControllers.removeProduct)
user_route.post('/addShipping',cartControllers.addShippingMethod)


// =========================================< Checkout and order >=================================================
user_route.get('/checkout',auth.isLogin,cartControllers.loadCheckout)
user_route.post('/placeOrder',orderControllers.placeOrder)
user_route.post('/verify-payment',orderControllers.verifyPayment)
user_route.get('/orderDetails',auth.isLogin,orderControllers.loadOrderDetails)
user_route.post('/cancelOrder',orderControllers.cancelOrder)
user_route.get('/orderSuccess',auth.isLogin,orderControllers.loadOrderSuccess)
user_route.post('/invoice',orderControllers.loadInvoice)


// =========================================< Wishlist >=================================================
user_route.post('/addToWishList',auth.isLogin,wishlistControllers.addToWishList)
user_route.get('/wishlist',auth.isLogin,wishlistControllers.loadWishlist)
user_route.post('/removeWish',wishlistControllers.removeProduct)


// =========================================< Coupon >=================================================
user_route.post('/checkCoupon',couponControllers.checkCoupon)
user_route.post('/removeCoupon',couponControllers.removeCoupon)


// =========================================< Product Review >=================================================
user_route.post('/productReview',reviewControllers.addReview)
user_route.post('/submitReply',reviewControllers.addReplay)
user_route.post('/addLike',reviewControllers.addLike)


module.exports =user_route
