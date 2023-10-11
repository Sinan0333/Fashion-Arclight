const Order = require("../model/orderModel")
const Address = require("../model/addressModel");
const Cart = require('../model/cartModel')
const Product = require('../model/productModel')


// to place order
const placeOrder = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const paymentMethod = req.body.payment
        const addressIndex = req.body.address
        if(!addressIndex){
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


//Admin order management
const loadOrderManagement = async(req,res)=>{
  try {
  
    const OrderData = await Order.find()

    res.render('orderManagement',{orders:OrderData})

  } catch (error) {

      console.log(error.message);

  }
}

//Admin order management
const loadOrderInvoice = async(req,res)=>{
  try {
  
    const order_id = req.query._id
    console.log(order_id);
    const OrderData = await Order.findOne({_id:order_id}).populate('products.productId')
    // console.log(OrderData.products.productId.name);
    console.log(OrderData);
    res.render('invoice',{orders:OrderData})

  } catch (error) {

      console.log(error.message);

  }
}

module.exports ={
  placeOrder,
  loadOrderManagement,
  loadOrderInvoice
    
  }