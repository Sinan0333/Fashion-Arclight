const Wishlist = require("../model/wishlistModel");


// Show Wishlist
const loadWishlist = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const wishlistData =  await Wishlist.findOne({user:user_id}).populate('products.productId')

        if(wishlistData){

          res.render('wishlist',{wishlist:wishlistData,})
        }else{
          res.render('wishlist',{wishlist:null})
        }

    } catch (error) {
        console.log(error.message);
    }
}



// add to wishlist
const addToWishList = async(req,res)=>{
    try {
        
      const product_id = req.body.productId
      const user_id = req.session.user_id
      const data={
        productId:product_id,
    }
    await Wishlist.findOneAndUpdate(

        { user: user_id },
        {
          $set: { user: user_id },
          $push: { products: data }
        },
        { upsert: true, new: true }

    )
    res.json({add:true})
      
    } catch (error) {
        console.log(error.message);
    }
}
  
// remove products from the cart
const removeProduct = async(req,res)=>{
    try {

      const product_id = req.body.productId
      const user_id = req.session.user_id
      const wishlistData =  await Wishlist.findOneAndUpdate({user:user_id},{$pull:{products:{productId:product_id}}})
      if(wishlistData){
        res.json({remove:true})
      }else{
        res.json({remove:false})
      }n
    } catch (error) {
        console.log(error.message);
    }
  }

module.exports ={
  addToWishList,
  loadWishlist,
  removeProduct,
}