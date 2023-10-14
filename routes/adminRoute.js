const express = require('express')
const admin_route = express()
const session = require('express-session')


// =========================================< Controllers >=================================================
const adminControllers=require('../controller/adminControllers')
const productControllers=require('../controller/productControllers')
const categoryControllers = require('../controller/categoryControllers')
const orderControllers=require('../controller/orderControllers')


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
admin_route.post('/addProduct',multer.prducts.array('images',4),productControllers.addProduct)
admin_route.get('/blockProduct',auth.isLogin,productControllers.blockProduct)
admin_route.get('/editProduct',auth.isLogin,productControllers.loadEditProduct)
admin_route.post('/editProduct',multer.prducts.any(),productControllers.editProduct)
admin_route.get('/deleteProduct',productControllers.deleteProduct)


// =========================================< Order Management  >=================================================
admin_route.get('/order',auth.isLogin,orderControllers.loadOrderManagement)
admin_route.get('/orderSummary',auth.isLogin,orderControllers.loadOrderSummary)
admin_route.post('/updateOrder',orderControllers.updateOrder)


module.exports = admin_route