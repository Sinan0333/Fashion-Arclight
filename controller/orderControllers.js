const Order = require("../model/orderModel");
const Address = require("../model/addressModel");
const Cart = require('../model/cartModel')

// to place order
const placeOrder = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const paymentMethod = req.body.payment
        const addressIndex = req.body.address
        const addressData = await Address.findOne({user:user_id})
        const address = addressData.address[addressIndex]
        const cartData = await Cart.findOne({user:user_id})
        const productData = cartData.products

        const data = {
        deliveryDetails:address,
        products:productData,
        date:new Date(),
        status:'pending',
        paymentMethod:paymentMethod,
       }

       await Order.findOneAndUpdate(

        { user: user_id },
        {
          $set: data,
        },
        { upsert: true, new: true }

      );
  
    } catch (error) {
        console.log(error.message);
    }
}



module.exports ={
   placeOrder
  
    
  }