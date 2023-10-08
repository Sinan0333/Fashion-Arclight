const Cart = require('../model/cartModel')
const Product = require('../model/productModel')


// Show Cart
const loadCart = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const cartData =  await Cart.findOne({user:user_id}).populate('products.productId')
        
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
        const cartData = await Cart.findOne({'products.productId':product_id})

        if(productData.quantity>0){

            if(cartData){
                await Cart.findOneAndUpdate(
                    { user: user_id ,'products.productId':product_id},
                    {$inc:{'products.$.count':1}}
                )
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
        
                );
            }
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
        const count = req.body.count
        const cartData = await Cart.findOne({'products.productId':product_id})
        const product = cartData.products.filter((obj)=>obj.productId==product_id)
        const productData = await Product.findById(product_id)

        if((product[0].count>=1&&count>0&&product[0].count <productData.quantity)||(product[0].count>=2&&count<0 )){
            const cartData = await Cart.findOneAndUpdate({'products.productId':product_id},{$inc:{'products.$.count':count}})
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
            res.json({stock:true})
        }else{
            if(product[0].count>1){
                res.json({stock:false})
            }
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
  addToCart,
  loadCart,
  updateCart,
}