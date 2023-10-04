const express = require('express')
const user_route = express()
const bodyparser = require('body-parser')
const session = require('express-session')

const userControllers=require('../controller/userControllers')
const addressControllers=require('../controller/addressControllers')
const config = require('../config/config')
const auth = require('../middleware/auth')


user_route.set('view engine','ejs')
user_route.set('views','./views/user')


// =========================================< MiddleWares>=================================================
user_route.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized:true
}))
user_route.use(bodyparser.json())
user_route.use(bodyparser.urlencoded({extended:true}))


// =========================================< Login Logout >=================================================
user_route.get('/login',auth.isLogout,userControllers.loadlogin)
user_route.post('/login',userControllers.verifyLogin)
user_route.get('/logout',auth.isLogin,userControllers.userLogout)


// =========================================< Signup verification >=================================================
user_route.get('/signUp',auth.isLogout,userControllers.loadRegister)
user_route.post('/signUp',userControllers.insertUser)
user_route.post('/validate',userControllers.otpVarification)
user_route.get('/resend',auth.isLogout,userControllers.resendOtp)


// =========================================< Home Page >=================================================
user_route.get('/',userControllers.loadHome)
user_route.get('/profile',auth.isLogin,userControllers.loadprofile)
user_route.post('/addAddress',addressControllers.addAddress)
user_route.get('/editAddress',addressControllers.loadEditAddress)
user_route.post('/editAddress',addressControllers.editAddress)
user_route.post('/editProfile',userControllers.editProfile)
user_route.get('/sample',userControllers.sample)




// =========================================< Product Details >=================================================
user_route.get('/product',auth.isLogin,userControllers.loadProduct)


// user_route.use((req, res) => {
//     res.status(404).render('Error');
//   });


module.exports =user_route
