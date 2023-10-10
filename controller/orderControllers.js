const Order = require("../model/orderModel");
const Address = require("../model/addressModel");
const Cart = require('../model/cartModel')
const Product = require('../model/productModel')


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
        const total = productData.reduce((acc,val)=> acc+val.totalPrice,0)
        const data = new Order({
        user:user_id,
        deliveryDetails:address,
        products:productData,
        date:new Date(),
        totalAmount:total,
        status:'pending',
        paymentMethod:paymentMethod,
       })

       const result = await data.save()
      
      for( let i=0;i<cartData.products.length;i++){
        let product = cartData.products[i].productId
        let count = cartData.products[i].count
        await Product.updateOne({_id:product},{$inc:{quantity:-count}})
      }

      await Cart.deleteOne({user:user_id})
      res.render('orderSuccess')
  
    } catch (error) {
        console.log(error.message);
    }
}



module.exports ={
   placeOrder
  
    
  }