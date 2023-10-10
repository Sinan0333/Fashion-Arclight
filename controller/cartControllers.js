const Cart = require('../model/cartModel')
const Product = require('../model/productModel')
const Address = require("../model/addressModel");


// Show Cart
const loadCart = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const cartData =  await Cart.findOne({user:user_id}).populate('products.productId')
        if(cartData){
          const total = await Cart.aggregate([
            {
              $match: { _id: cartData._id } 
            },
            {
              $unwind: '$products' 
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $multiply: ['$products.price', '$products.count'] 
                  }
                }
              }
            }
          ]);
          res.render('cart',{cart:cartData,total:total})
        }else{
          res.render('cart',{cart:null})
        }

    } catch (error) {
        console.log(error.message);
    }
}


//add to cart
const addToCart = async(req,res)=>{
    try {
        const user_id = req.session.user_id;
        const product_id = req.body.productId
        const productData = await Product.findById(product_id)
        const cartData = await Cart.findOne({ user: user_id ,'products.productId':product_id})
      console.log("step 1");
        if(productData.quantity>0){
          console.log("step 2");
            if(cartData){
                await Cart.findOneAndUpdate(
                    { user: user_id ,'products.productId':product_id},
                    {$inc:{'products.$.count':1}}
                )
                console.log("step 2.1");
            }else{
                const data={
                    productId:product_id,
                    price:productData.price,
                    totalPrice:productData.price
                }
                await Cart.findOneAndUpdate(
    
                    { user: user_id },
                    {
                      $set: { user: user_id },
                      $push: { products: data }
                    },
                    { upsert: true, new: true }
        
                )
            }
            console.log("step 2.2");
            res.json({stock:true})
            
        }else{
            res.json({stock:false})
        }   
         
    } catch (error) {
        console.log(error.message);
    }
}


//update cart and stock
const updateCart = async(req,res)=>{
    try {

      const product_id = req.body.productId
      const user_id = req.session.user_id
      const count = req.body.count
      const cartData = await Cart.findOne({ user: user_id })
      const product = cartData.products.filter((obj)=>obj.productId==product_id)
      const productData = await Product.findById(product_id)

        if((product[0].count>=1&&count>0&&product[0].count <productData.quantity)||(product[0].count>=2&&count<0 )){
          console.log("step 1");
            const cartData = await Cart.findOneAndUpdate({user:user_id,'products.productId':product_id},{$inc:{'products.$.count':count}})
            console.log("step 2");
            console.log(cartData);
            const total = await Cart.aggregate([
                {
                  $match: { _id: cartData._id } 
                },
                {
                  $unwind: '$products' 
                },
                {
                    $match: { 'products.productId': product_id } 
                  },
                {
                  $group: {
                    _id: null,
                    total: {
                      $sum: {
                        $multiply: ['$products.price', '$products.count'] 
                      }
                    }
                  }
                }
              ]);
              
            await Cart.findOneAndUpdate({'products.productId':product_id},{$set:{'products.$.totalPrice':total[0].total}})
            console.log("step 3");
            res.json({stock:true})
        }else{
            if(product[0].count>1){
                res.json({stock:false})
            }else{
              res.json({stock:true})
            }
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


// remove products from the cart
const removeProduct = async(req,res)=>{
  try {
      
    const product_id = req.body.productId
    const user_id = req.session.user_id
    const cartData =  await Cart.findOneAndUpdate({user:user_id},{$pull:{products:{productId:product_id}}})
    if(cartData){
      res.json({remove:true})
    }else{
      res.json({remove:false})
    }
  } catch (error) {
      console.log(error.message);
  }
}


// Show Checkout page
const loadCheckout = async(req,res)=>{
  try {
    
    const user_id = req.session.user_id
    const addressData = await Address.findOne({user:user_id})
    const cartData = await Cart.findOne({user:user_id}).populate('products.productId')
    const stock = cartData.products.filter((val,ind)=>val.productId.quantity>0)
    if(stock.length!=cartData.products.length){
      console.log("ibade");
      res.json({stock:false})
    }
    const total = await Cart.aggregate([
      {
        $match: { _id: cartData._id } 
      },
      {
        $unwind: '$products' 
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $multiply: ['$products.price', '$products.count'] 
            }
          }
        }
      }
    ]);
   
    res.render("checkout",{addresses:addressData,cart:cartData,total:total})

  } catch (error) {
      console.log(error.message);
  }
}





module.exports ={
  addToCart,
  loadCart,
  updateCart,
  removeProduct,
  loadCheckout,

  
}