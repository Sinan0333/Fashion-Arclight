const Wishlist = require("../model/wishlistModel");


// Show Wishlist
const loadWishlist = async(req,res)=>{
    try {
        
        const user_id = req.session.user_id
        const wishlistData =  await Wishlist.findOne({user:user_id}).populate('products.productId')

        if(wishlistData){

          res.render('wishlist',{wishlist:wishlistData,user_id})
        }else{
          res.render('wishlist',{wishlist:null,user_id})
        }

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// add to wishlist
const addToWishList = async(req,res)=>{
    try {
        
      const product_id = req.body.productId
      const user_id = req.session.user_id

      const wishlistData =await Wishlist.findOne({'products.productId':product_id})

      if(wishlistData){
        await Wishlist.findOneAndUpdate(
          { 'products.productId': product_id },
          { $pull: { 'products': { 'productId': product_id } } }
        );
        res.json({remove:true})
      }else{

        const data={
          productId:product_id,
        }

      await Wishlist.findOneAndUpdate(
        { user: user_id },
        { $addToSet: { products: data } },
        { upsert: true, new: true }
      );

      res.json({add:true})

      }
     
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
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
        res.render('500Error')
    }
  }

  
module.exports ={
  addToWishList,
  loadWishlist,
  removeProduct,
}