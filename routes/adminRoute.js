const express = require('express')
const admin_route = express()
const bodyparser = require('body-parser')
const session = require('express-session')


const adminControllers=require('../controller/adminControllers')
const productControllers=require('../controller/productControllers')
const categoryControllers = require('../controller/categoryControllers')
const orderControllers=require('../controller/orderControllers')
const config = require('../config/config')
const auth = require('../middleware/adminAuth')
const multer = require('../middleware/multer')


admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')


// =========================================< MiddleWare >=================================================
admin_route.use(session({
    secret:config.sessionSecret,
    resave: false,
    saveUninitialized:true
}))
admin_route.use(bodyparser.json())
admin_route.use(bodyparser.urlencoded({extended:true}))



// =========================================< Login logout  >=================================================
admin_route.get('/login',auth.isLogout,adminControllers.loadlogin)
admin_route.post('/login',adminControllers.verifyLogin)
admin_route.get('/logout',adminControllers.adminLogout)


// =========================================< Dashboard  >=================================================
admin_route.get('/',auth.isLogin,adminControllers.loadDashboard)


// =========================================< User Management  >=================================================
admin_route.get('/user',auth.isLogin,adminControllers.loadUserManagement)
admin_route.get('/blockUser',auth.isLogin,adminControllers.blockUser)


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
admin_route.get('/order',orderControllers.loadOrderManagement)
admin_route.get('/orderSummary',orderControllers.loadOrderSummary)


// admin_route.get('/order',orderControllers.loadOrderManagement)
// admin_route.use((req, res) => {
//     res.status(404).render('Error');
//   });

module.exports = admin_route