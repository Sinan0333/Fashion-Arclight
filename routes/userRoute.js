const express = require('express')
const user_route = express()
const session = require('express-session')


// =========================================< Controllers >=================================================
const userControllers=require('../controller/userControllers')
const addressControllers=require('../controller/addressControllers')
const cartControllers=require('../controller/cartControllers')
const orderControllers=require('../controller/orderControllers')


const config = require('../config/config')
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


// =========================================< Home Page >=================================================
user_route.get('/',userControllers.loadHome)
user_route.get('/product',auth.isLogin,userControllers.loadProduct)


// =========================================< Profile >=================================================
user_route.get('/profile',auth.isLogin,userControllers.loadprofile)
user_route.get('/editProfile',auth.isLogin,userControllers.loadEditProfile)
user_route.post('/editProfile',multer.user.single('img'),userControllers.editProfile)


// =========================================< Address >=================================================
user_route.get('/addAddress',auth.isLogin,addressControllers.loadAddAddress)
user_route.post('/addAddress',addressControllers.addAddress)
user_route.get('/editAddress',auth.isLogin,addressControllers.loadEditAddress)
user_route.post('/editAddress',addressControllers.editAddress)
user_route.get('/deleteAddress',auth.isLogin,addressControllers.deleteAddress)


// =========================================< Cart >=================================================
user_route.post('/addToCart',cartControllers.addToCart)
user_route.get('/cart',auth.isLogin,cartControllers.loadCart)
user_route.post('/updateCart',cartControllers.updateCart)
user_route.post('/removeProduct',cartControllers.removeProduct)


// =========================================< Checkout and order >=================================================
user_route.get('/checkout',auth.isLogin,cartControllers.loadCheckout)
user_route.post('/placeOrder',orderControllers.placeOrder)
user_route.get('/orderDetails',auth.isLogin,orderControllers.loadOrderDetails)
user_route.post('/cancelOrder',orderControllers.cancelOrder)
user_route.get('/sample',userControllers.sample)




// user_route.use((req, res) => {
//     res.status(404).render('Error');
//   });


module.exports =user_route
