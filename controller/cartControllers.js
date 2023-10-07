const Cart = require('../model/cartModel')
const Product = require('../model/productModel')


// Show Cart
const loadCart = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const cartData =  await Cart.findOne({user:user_id}).populate('products.productId')
        // console.log(cartData.products[0].productId);
        // console.log(cartData);
        res.render('cart',{cart:cartData})
  
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

        if(productData.quantity>0){
            const data={
                productId:product_id,
                price:productData.price,
            }

            await Cart.findOneAndUpdate(

                { user: user_id },
                {
                  $set: { user: user_id },
                  $push: { products: data }
                },
                { upsert: true, new: true }
    
              );
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

        const user_id = req.session.user_id;
        const product_id = req.body.productId
        const count = req.body.count
        const cartData = await Cart.findOneAndUpdate({'products.productId':product_id},{$inc:{'products.$.count':count}})
        console.log(cartData);
         
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
  addToCart,
  loadCart,
  updateCart,
}