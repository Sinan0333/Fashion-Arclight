const Order = require("../model/orderModel")
const User = require("../model/userModel")
const Address = require("../model/addressModel");
const Cart = require('../model/cartModel')
const Product = require('../model/productModel');
const Razorpay = require('razorpay');
const crypto = require("crypto")
require("dotenv").config()

var instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

// =========================================< User side >=================================================


// to place order
const placeOrder = async(req,res)=>{
    try {

        const user_id = req.session.user_id
        const paymentMethod = req.body.payment
        const addressIndex = !req.body.address? 0:req.body.address
        const status = paymentMethod=="COD"?"placed":'pending'
        const total = req.body.total
        const userData = await User.findOne({_id:user_id})

        if(!req.body.address){
          const data = {
            fullName:req.body.name,
            mobile:req.body.mobile,
            email:req.body.email,
            houseName:req.body.house,
            state:req.body.state,
            city:req.body.city,
            pin:req.body.pincode,
          }
          await Address.findOneAndUpdate(

            { user: user_id },
            {
              $set: { user: user_id },
              $push: { address: data }
            },
            { upsert: true, new: true }

          );
        }

        const addressData = await Address.findOne({user:user_id})
        const address = addressData.address[addressIndex]
        const cartData = await Cart.findOne({user:user_id})
        const productData = cartData.products
        // const total = productData.reduce((acc,val)=> acc+val.totalPrice,0)
        
        const data = new Order({
        user:user_id,
        deliveryDetails:address,
        products:productData,
        date:new Date(),
        totalAmount:total,
        status:status,
        paymentMethod:paymentMethod,
        shippingMethod:cartData.shippingMethod,
        shippingAmount:cartData.shippingAmount,
        couponDiscount:cartData.couponDiscount,
       })

       const orderData = await data.save()

       if(status=='placed'){
      
        for( let i=0;i<cartData.products.length;i++){
          let product = cartData.products[i].productId
          let count = cartData.products[i].count
          await Product.updateOne({_id:product},{$inc:{quantity:-count}})
        }
  
        await Cart.deleteOne({user:user_id})
        res.json({placed:true})

       }else if(paymentMethod == 'wallet'){

        if(userData.wallet >= total){

          const data ={
            amount:-total,
            date:new Date()
          }

          const updateOrder = await Order.findOneAndUpdate({_id:orderData._id},{$set:{status:'placed'}})
          const updateWallet = await User.findOneAndUpdate({_id:user_id},{$inc:{wallet:-total},$push:{walletHistory:data}})

          for( let i=0;i<cartData.products.length;i++){
            let product = cartData.products[i].productId
            let count = cartData.products[i].count
            await Product.updateOne({_id:product},{$inc:{quantity:-count}})
          }

          await Cart.deleteOne({user:user_id})
          res.json({placed:true})

        }else{
          res.json({wallet:false})
        }

       }
       else{

        const options ={
          amount: total*100,
          currency: "INR",
          receipt: ""+orderData._id,
        }

        instance.orders.create(options, function (err, order) {

          res.json({ order });
        });

       }
  
    } catch (error) {
        console.log(error.message);
    }
}


// verifying the online paynent
const verifyPayment = async(req,res)=>{
  try {
    
    const user_id = req.session.user_id
    const paymentData = req.body
    const cartData = await Cart.findOne({user:user_id})

    const hmac = crypto.createHmac("sha256", process.env.key_secret);
    hmac.update( paymentData.payment.razorpay_order_id  +"|" +  paymentData.payment.razorpay_payment_id );
    const hmacValue = hmac.digest("hex");

    if(hmacValue == paymentData.payment.razorpay_signature){
      for( let i=0;i<cartData.products.length;i++){
        let product = cartData.products[i].productId
        let count = cartData.products[i].count
        await Product.updateOne({_id:product},{$inc:{quantity:-count}})
      }

      await Order.findByIdAndUpdate(
        { _id: paymentData.order.receipt },
        { $set: { status: "placed", paymentId: paymentData.payment.razorpay_payment_id } }
      );
  
      await Cart.deleteOne({user:user_id})
      res.json({placed:true})
    }

  } catch (error) {

      console.log(error.message);

  }
}


// Load User Order Details
const loadOrderDetails = async(req,res)=>{
  try {
  
    const user_id = req.session.user_id
    const order_id = req.query._id
    const orderData = await Order.findOne({_id:order_id}).populate('products.productId')
    await orderData.populate('products.productId.category')
    res.render('orderDetails',{order:orderData,user_id})

  } catch (error) {

      console.log(error.message);

  }
}


//User cancel order
const cancelOrder = async(req,res)=>{
  try {

    const user_id = req.session.user_id
    const order_id = req.body.orderId
    const cancelReaon = req.body.cancelReason
    const orderData = await Order.findOneAndUpdate({_id:order_id},{$set:{status:'cancel',cancelReason:cancelReaon}})

    for( let i=0;i<orderData.products.length;i++){
      let product = orderData.products[i].productId
      let count = orderData.products[i].count
      await Product.updateOne({_id:product},{$inc:{quantity:count}})
    }

    if(orderData.paymentMethod != 'COD'&& orderData.status != 'pending'){

      const data = {
        amount:orderData.totalAmount,
        date:new Date()
      }
  
      const ussrData = await User.findOneAndUpdate({_id:user_id},{$inc:{wallet:orderData.totalAmount},$push:{walletHistory:data}})
      
    }
   
    res.json({cancel:true})  
  } catch (error) {

      console.log(error.message);

  }
}


// Load User Order Details
const loadInvoice = async(req,res)=>{
  try {

    const order_id = req.query._id
    const orderData = await Order.findOne({_id:order_id}).populate('products.productId')
    await orderData.populate('products.productId.category')
    res.render('invoice',{orders:orderData})

  } catch (error) {

      console.log(error.message);

  }
}


// Load order succes page
const loadOrderSuccess = async(req,res)=>{
  try {
    const user_id = req.session.user_id
    res.render('orderSuccess',{user_id})
  } catch (error) {
      console.log(error.message);
  }
}


// =========================================< Admin side >=================================================


//Admin order management
const loadOrderManagement = async(req,res)=>{
  try {
  
    const OrderData = await Order.find()

    res.render('orderManagement',{orders:OrderData})

  } catch (error) {

      console.log(error.message);

  }
}


// Load Admin Order Detail
const loadOrderSummary = async(req,res)=>{
  try {
  
    const order_id = req.query._id
    const OrderData = await Order.findOne({_id:order_id}).populate('products.productId')
    res.render('orderDetails',{order:OrderData})

  } catch (error) {

      console.log(error.message);

  }
}


// to update order status
const updateOrder = async(req,res)=>{
  try {

    const order_id = req.body.orderId
    const orderStatus = req.body.status
    const user_id = req.session.user_id
    if(orderStatus == 'cancel'){
      const orderData = await Order.findOneAndUpdate({_id:order_id},{$set:{status:orderStatus,cancelReason:'There was a problem in youre order'}})

      for( let i=0;i<orderData.products.length;i++){
        let product = orderData.products[i].productId
        let count = orderData.products[i].count
        await Product.updateOne({_id:product},{$inc:{quantity:count}})
      }
   if(orderData.paymentMethod != 'COD'&& orderData.status != 'pending'){

    const data = {
      amount:orderData.totalAmount,
      date:new Date()
    }

    const userData = await User.findOneAndUpdate({_id:user_id},{$inc:{wallet:orderData.totalAmount},$push:{walletHistory:data}})

   }
      
    }else{
      const OrderData = await Order.findOneAndUpdate({_id:order_id},{$set:{status:orderStatus}})
    }
   
      res.json({update:true})  

  } catch (error) {

      console.log(error.message);

  }
}


// Load Admin Order Detail
const userOrders= async(req,res)=>{
  try {
  
    const user_id = req.query.userId
    const userData = await User.findOne({_id:user_id})
    const OrderData = await Order.find({user:user_id})
    res.render('userOrder',{orders:OrderData,user:userData})

  } catch (error) {

      console.log(error.message);

  }
}




module.exports ={
  placeOrder,
  loadOrderManagement,
  loadOrderDetails,
  cancelOrder,
  loadOrderSummary,
  updateOrder,
  loadOrderSuccess,
  verifyPayment,
  loadInvoice,
  userOrders,
  }