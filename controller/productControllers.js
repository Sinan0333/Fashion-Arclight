const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Banner = require('../model/bannerModel')
const Offer = require("../model/offerModel")
const Review = require('../model/reviewModel')
const Wishlist = require('../model/wishlistModel')
const Sharp = require('sharp')
const fs = require('fs');


// =========================================< User side >=================================================


// load home page (index.js)
const loadHome = async (req, res) => {
  try {

    const productData = await Product.find({is_blocked:false}).populate({
      path: 'category',
      match: { is_blocked: false } 
    })
    const user_id = req.session.user_id
    const bannerData =await Banner.find({is_blocked:false})
    const categoryData = await Category.find().sort({name:1})
    const categoryId = categoryData.map((val)=>val._id.toString())
    const wishlistData = await Wishlist.findOne({user:req.session.user_id})
    const wishData = wishlistData ? wishlistData.products.map((val) => val.productId) : [];

    res.render("index",{products:productData,banners:bannerData,categorys:categoryId,wishData,user_id});
  } catch(error) {
    console.log(error.message);
    res.render('500Error')
  }
};


//to load shop page
const loadShop = async(req,res)=>{
  try {
    const user_id = req.session.user_id
    const category = req.query.category 
    const page = req.query.page ? req.query.page : 1
    const prevPage = page-1
    const totalDoc = await Product.countDocuments();
    const categoryData = await Category.find().sort({name:1})
    const wishlistData = await Wishlist.findOne({user:req.session.user_id})
    const wishData = wishlistData ? wishlistData.products.map((val) => val.productId) : [];

    if(category){
      const productData =await Product.find({category:category}).skip(prevPage*4).limit(4)
      res.render('shop',{products:productData,categorys:categoryData,wishData,user_id,totalDoc,page})
    }else{
      const productData =await Product.find().skip(prevPage*4).limit(4)
      res.render('shop',{products:productData,categorys:categoryData,wishData,user_id,totalDoc,page})
    }
      
  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}


//load product page
const loadProduct = async (req, res) => {
  try {
    const product_id=req.query._id
    const user_id =req.session.user_id
    const productData = await Product.findOne({_id:product_id}).populate('category').populate('offer')
    const offerPrice = productData.price-productData.offer.discountAmount 
    const relatedProducts =await Product.find({category:productData.category._id})
    const reviewData = await Review.findOne({productId:product_id}).populate('review.user').populate('review.replay.user')
    const reviews =reviewData ? reviewData.review:[]
    const avgRatig =reviews ? reviews.reduce((acc,val)=>acc+val.rating,0)/reviews.length : 0
    const wishProduct = await Wishlist.findOne({user:user_id,'products.productId':product_id})
    res.render("product",{product:productData,relatedProducts:relatedProducts,offerPrice:offerPrice,reviews:reviews,avgRatig:avgRatig,user_id,wishProduct,user:user_id});
  } catch(error) {
    console.log(error.message);
    res.render('500Error')
  }
};


// For sort products
const productFilter = async (req, res) => {
  try {

    const user_id = req.session.user_id
    const price = req.query.price
    const page = req.query.page ? req.query.page : 1
    const searchQuery =  req.query.search? req.query.search : ""
    const prevPage = page-1
    const splitPrice =price.split('-')
    const minimum= parseInt(splitPrice[0])
    const maximum = parseInt(splitPrice[1])  
    const sort =parseInt( req.query.sort)
    const category = req.query.category
    const categoryData = await Category.find()
    const totalDoc = await Product.countDocuments();
    const wishlistData = await Wishlist.findOne({user:req.session.user_id})
    const wishData = wishlistData ? wishlistData.products.map((val) => val.productId) : [];
    if(category=='all'){

      const productData = await Product.find({
        name:{ $regex:searchQuery, $options:'i'},
        price: { $gte: minimum, $lte: maximum }
      }).sort({ price: sort }).skip(prevPage*4).limit(4)

      res.render('shop',{products:productData,categorys:categoryData,wishData,user_id,totalDoc,page})

    }else{

      const productData = await Product.find({
        name:{ $regex:searchQuery, $options:'i'},
        price: { $gte: minimum, $lte: maximum },category:category
      }).sort({ price: sort }).skip(prevPage*4).limit(4)

      res.render('shop',{products:productData,categorys:categoryData,wishData,user_id,totalDoc,page})
    }


  } catch(error) {
    console.log(error.message);
    res.render('500Error')
  }
};

// =========================================< Admin side >=================================================


// load productManagement page dynamically
const loadProductManagement = async(req,res)=>{
    try {
      const productData = await Product.find().populate("category").populate("offer")
      res.render('productManagement',{products:productData})
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// load add product page 
const loadAddProduct = async(req,res)=>{
    try {
     
      const categoryData = await Category.find({is_blocked:false})
      const offerData = await Offer.find({is_blocked:false})
      res.render('addProduct',{categorys:categoryData,offers:offerData})
  
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// to add product 
const addProduct = async(req,res)=>{
  try {
      const offer = req.body.offer
      const offerData = await Offer.findOne({name:offer})
      const category  = await Category.findOne({name:req.body.category})
      const files = await req.files;

      const img = [
        files.image1[0].filename,
        files.image2[0].filename,
        files.image3[0].filename,
        files.image4[0].filename,
      ];

      for (let i = 0; i < img.length; i++) {
          await Sharp("public/images/product/orginal/" + img[i]).resize(500, 500).toFile("public/images/product/sharped/" + img[i]);
      }
     
    const data = new Product({
      name:req.body.name,
      category:category._id,
      quantity:req.body.quantity,
      price:req.body.price,
      "images.image1": files.image1[0].filename,
      "images.image2": files.image2[0].filename,
      "images.image3": files.image3[0].filename,
      "images.image4": files.image4[0].filename,
      offer:offerData._id,
      description:req.body.description,
      is_blocked:false
    })

    await data.save()
    res.redirect('/admin/product')

  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}


// to update  product name
const loadEditProduct = async(req,res)=>{
    try {
  
      const  product_id =  req.query._id;
      const productData = await Product.findOne({_id:product_id}).populate('category').populate("offer")
      const offerData = await Offer.find({is_blocked:false})
      const categoryData = await Category.find({is_blocked:false})
      res.render('editProduct',{product:productData,categorys:categoryData,offers:offerData})
  
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// to edit product
const editProduct = async (req, res) => {
  try {
    const product_id = req.query._id;
    let imagesFiles = await req.files;
    const productData = await Product.findOne({ _id: product_id });
    const category  = await Category.findOne({name:req.body.category})
    const offer = req.body.offer
    const offerData = await Offer.findOne({name:offer}) 

    const img = [
      imagesFiles.image1 ? imagesFiles.image1[0].filename : productData.images.image1,
      imagesFiles.image2 ? imagesFiles.image2[0].filename : productData.images.image2,
      imagesFiles.image3 ? imagesFiles.image3[0].filename : productData.images.image3,
      imagesFiles.image4 ? imagesFiles.image4[0].filename : productData.images.image4,
    ];

    for (let i = 0; i < img.length; i++) { 
        await Sharp("public/images/product/orginal/" + img[i])
          .resize(500, 500)
          .toFile("public/images/product/sharped/" + img[i]);
      }

      let img1, img2, img3, img4;

      img1 = imagesFiles.image1 ? imagesFiles.image1[0].filename : productData.images.image1;
      img2 = imagesFiles.image2 ? imagesFiles.image2[0].filename : productData.images.image2;
      img3 = imagesFiles.image3 ? imagesFiles.image3[0].filename : productData.images.image3;
      img4 = imagesFiles.image4 ? imagesFiles.image4[0].filename : productData.images.image4;

    // const deleteImagePromises = imagefileName.map((image) => {
    //   const imagePathOrginal = `public/images/product/orginal/${image}`;
    //   const imagePathSharped = `public/images/product/sharped/${image}`;

    //   return new Promise((resolve, reject) => {
    //     try {
    //       fs.unlinkSync(imagePathOrginal);
    //       fs.unlinkSync(imagePathSharped);
    //       resolve();
    //     } catch (error) {
    //       reject(error);
    //     }
    //   });
    // });


    // await Promise.all(deleteImagePromises);

    // const img = [];
    // for (let i = 0; i < req.files.length; i++) { 
    //   img.push(req.files[i].filename);
    //   await Sharp("public/images/product/orginal/" + req.files[i].filename)
    //     .resize(500, 500)
    //     .toFile("public/images/product/sharped/" + req.files[i].filename);
    // }
    
  

    await Product.findByIdAndUpdate(
      { _id: product_id },
      {
        $set: {
          name: req.body.name,
          category: category._id,
          quantity: req.body.quantity,
          price: req.body.price,
          offer: offerData._id,
          "images.image1": img1,
          "images.image2": img2,
          "images.image3": img3,
          "images.image4": img4,
          description: req.body.description,
        },
      }
    );

    res.redirect('/admin/product');
  } catch (error) {
    console.log(error.message);
    res.render('500Error')
  }
};


// to block product 
const blockProduct = async(req,res)=>{
    try {
  
      const  product_id =  req.query._id
      const productData = await Product.findOne({_id:product_id})
      if(productData.is_blocked){
       await Product.findByIdAndUpdate({_id:product_id},{$set:{is_blocked:false}}) 
      }else{  
        await Product.findByIdAndUpdate({_id:product_id},{$set:{is_blocked:true}})
      }
  
      res.redirect('/admin/product')
  
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


//to deleteproduct
const deleteProduct = async(req,res)=>{
  try {

    const  product_id =  req.query._id
    const productData =await Product.findOne({_id:product_id})
    
    for (const key in productData.images) {

      if ( productData.images.hasOwnProperty(key)) {

        const value = productData.images[key];
        const imagePathOrginal = `public/images/product/orginal/${value}`
        const imagePathSharped = `public/images/product/sharped/${value}`

        fs.unlinkSync(imagePathOrginal)
        fs.unlinkSync(imagePathSharped)
      }
    }

    await Product.findByIdAndDelete(product_id)
    res.redirect('/admin/product')

  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}






module.exports ={
    loadProductManagement,
    loadAddProduct,
    addProduct,
    blockProduct,
    loadEditProduct,
    editProduct,
    deleteProduct,
    loadHome,
    loadShop,
    loadProduct,
    productFilter,


}