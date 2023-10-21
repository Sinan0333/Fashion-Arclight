const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Banner = require('../model/bannerModel')
const Offer = require("../model/offerModel")
const Sharp = require('sharp')
const fs = require('fs');


// =========================================< User side >=================================================


// load home page (index.js)
const loadHome = async (req, res) => {
  try {

    const productData = await Product.find({is_blocked:false})
    const bannerData =await Banner.find({is_blocked:false})
    res.render("index",{products:productData,banners:bannerData});
  } catch {
    console.log(error.message);
  }
};


//to load shop page
const loadShop = async(req,res)=>{
  try {

    const  searchQuery =  req.body.search? req.body.search:""

        const searchResult=await Product.find(
            { name:{ $regex:searchQuery, $options:'i'}
        });
        res.render("shop",{products:searchResult});

  } catch (error) {

      console.log(error.message);

  }
}


//load product page
const loadProduct = async (req, res) => {
  try {
    const product_id=req.query._id
    const productData = await Product.findOne({_id:product_id}).populate('category')
    const largeOffer = productData.offer<productData.category.offer ? productData.category.offer : productData.offer
    const offerPrice = productData.price-largeOffer

    const relatedProducts =await Product.find({category:productData.category._id})
    console.log(relatedProducts);
    res.render("product",{product:productData,relatedProducts:relatedProducts,offerPrice:offerPrice,offer:largeOffer});
  } catch {
    console.log(error.message);
  }
};


// =========================================< Admin side >=================================================


// load productManagement page dynamically
const loadProductManagement = async(req,res)=>{
    try {
      const productData = await Product.find().populate("category")
      res.render('productManagement',{products:productData})
    } catch (error) {
        console.log(error.message);
    }
}


// load add product page 
const loadAddProduct = async(req,res)=>{
    try {
     
      const categoryData = await Category.find()
      const offerData = await Offer.find({offerFor:"Selected Products"})
      res.render('addProduct',{categorys:categoryData,offers:offerData})
  
    } catch (error) {
        console.log(error.message);
    }
}


// to add product 
const addProduct = async(req,res)=>{
  try {
      const img=[];
      let offer = req.body.offer
      const category  = await Category.findOne({name:req.body.category})
      for (let i = 0; i < req.files.length; i++) {
          img.push(req.files[i].filename);
          await Sharp("public/images/product/orginal/" + req.files[i].filename).resize(500, 500).toFile("public/images/product/sharped/" + req.files[i].filename);

      }
      if(offer!=0){
        const offerData = await Offer.findOne({name:req.body.offer})
        offer = offerData.discountAmount
      }
    const data = new Product({
      name:req.body.name,
      category:category._id,
      quantity:req.body.quantity,
      price:req.body.price,
      image:img,
      offer:offer,
      description:req.body.description,
      is_blocked:false
    })

    await data.save()
    res.redirect('/admin/product')

  } catch (error) {

      console.log(error.message);

  }
}


// to update  product name
const loadEditProduct = async(req,res)=>{
    try {
  
      const  product_id =  req.query._id;
      const productData = await Product.findOne({_id:product_id}).populate('category')
      const offerData = await Offer.find({offerFor:"Selected Products"})
      const categoryData = await Category.find()
      res.render('editProduct',{product:productData,categorys:categoryData,offers:offerData})
  
    } catch (error) {
  
        console.log(error.message);
  
    }
}


// to edit product
const editProduct = async (req, res) => {
  try {
    const product_id = req.query._id;
    const productData = await Product.findOne({ _id: product_id });
    const category  = await Category.findOne({name:req.body.category})
    const imagefileName = productData.image;
    let offer = req.body.offer

    const deleteImagePromises = imagefileName.map((image) => {
      const imagePathOrginal = `public/images/product/orginal/${image}`;
      const imagePathSharped = `public/images/product/sharped/${image}`;

      return new Promise((resolve, reject) => {
        try {
          fs.unlinkSync(imagePathOrginal);
          fs.unlinkSync(imagePathSharped);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });


    await Promise.all(deleteImagePromises);

    const img = [];
    for (let i = 0; i < req.files.length; i++) { 
      img.push(req.files[i].filename);
      await Sharp("public/images/product/orginal/" + req.files[i].filename)
        .resize(500, 500)
        .toFile("public/images/product/sharped/" + req.files[i].filename);
    }
    
    if(offer!=0){
      const offerData = await Offer.findOne({name:req.body.offer})
      offer = offerData.discountAmount
    }

    await Product.findByIdAndUpdate(
      { _id: product_id },
      {
        $set: {
          name: req.body.name,
          category: category._id,
          quantity: req.body.quantity,
          price: req.body.price,
          offer:offer,
          image: img,
          description: req.body.description,
        },
      }
    );

    res.redirect('/admin/product');
  } catch (error) {
    console.log(error.message);
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
  
    }
}


//to deleteproduct
const deleteProduct = async(req,res)=>{
  try {

    const  product_id =  req.query._id
    const productData =await Product.findOne({_id:product_id})
    const imagefileName = productData.image

    await Product.findByIdAndDelete(product_id)

    imagefileName.forEach( async (image) => {

      const imagePathOrginal = `public/images/product/orginal/${image}`
      const imagePathSharped = `public/images/product/sharped/${image}`

      fs.unlinkSync(imagePathOrginal)
      fs.unlinkSync(imagePathSharped)
 
    });

    res.redirect('/admin/product')

  } catch (error) {

      console.log(error.message);

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

}