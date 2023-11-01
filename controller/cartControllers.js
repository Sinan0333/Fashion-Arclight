const Cart = require('../model/cartModel')
const Product = require('../model/productModel')
const Address = require("../model/addressModel");


// Show Cart
const loadCart = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const cartData =  await Cart.findOne({user:user_id}).populate('products.productId')
        const offerData = cartData ? await cartData.populate('products.productId.offer'):0
        const subTotal = cartData ? cartData.products.reduce((acc,val)=>acc+val.totalPrice,0) : 0
        let eachProductDiscount=[];

        if(cartData){

          for(let i=0;i<cartData.products.length;i++){
            if( cartData.products[i].productId.offer.discountAmount !=0 && cartData.products[i].productId.offer.is_blocked==false){
              let amount = cartData.products[i].productId.offer.discountAmount * cartData.products[i].count
              eachProductDiscount.push(amount)
            }
          }
            const discount = eachProductDiscount.reduce((acc,val)=>acc+val,0)
            const total = subTotal-discount

          res.render('cart',{cart:cartData,subTotal:subTotal,total:total,discount:discount})

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
        const cartProduct = await Cart.findOne({ user: user_id ,'products.productId':product_id})

        if(productData.quantity>0){
            if(cartProduct){
              res.json({stock:true})  
            }else{
                const data={
                    productId:product_id,
                    price:productData.price,
                    totalPrice:productData.price,
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
      console.log('step 1');
        if((product[0].count>=1&&count>0&&product[0].count <productData.quantity)||(product[0].count>=2&&count<0 )){
            const cartData = await Cart.findOneAndUpdate({user:user_id,'products.productId':product_id},{$inc:{'products.$.count':count}})
            console.log(cartData);
            console.log('step 2');
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
              console.log(total);
              console.log('step 3');
            await Cart.findOneAndUpdate({'products.productId':product_id},{$set:{'products.$.totalPrice':total[0].total}})
            res.json({stock:true})
        }else{
            if(product[0].count>1){
              console.log('step 4');
                res.json({stock:false})
            }else{
              console.log('step 4');
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
    const productData = await Cart.aggregate([
      {
        $match: { user:user_id } 
      },
      {
        $unwind: '$products' 
      },
      {
          $match: { 'products.productId': product_id } 
        },
    ]);


    if(productData){
      await Cart.findOneAndUpdate({user:user_id},{$pull:{products:{productId:product_id}}})
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
    const cartData = await Cart.findOne({user:user_id}).populate('products.productId')

    if(cartData){
      let addressData = await Address.findOne({user:user_id})
      addressData = addressData == null ? {user:req.session.user_id,_id:1,address:[]} : addressData
     
      const offerData = await cartData.populate('products.productId.offer')
      const subTotal = cartData.products.reduce((acc,val)=>acc+val.totalPrice,0)
      const stock = cartData.products.filter((val,ind)=>val.productId.quantity>0)
      let eachProductDiscount=[];
  
      for(let i=0;i<cartData.products.length;i++){
        if( cartData.products[i].productId.offer.discountAmount !=0 && cartData.products[i].productId.offer.is_blocked == false){
          let amount = cartData.products[i].productId.offer.discountAmount * cartData.products[i].count
          eachProductDiscount.push(amount)
        }
      }
        const discount = eachProductDiscount.reduce((acc,val)=>acc+val,0)
        const total = subTotal-discount-cartData.couponDiscount
  
      if(stock.length!=cartData.products.length){
        res.json({stock:false})
      }
  
      res.render("checkout",{addresses:addressData,cart:cartData,subTotal:subTotal,total:total,discount:discount})
    }else{
      res.redirect('/')
    }
    

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