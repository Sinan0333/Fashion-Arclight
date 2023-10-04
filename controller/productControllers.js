const Product = require('../model/productModel')
const Category = require('../model/categoryModel')
const Sharp = require('sharp')
const fs = require('fs');



// =========================================< Load Pages >=================================================


// load productManagement page dynamically
const loadProductManagement = async(req,res)=>{
    try {
      const productData = await Product.find()
      res.render('productManagement',{products:productData})
    } catch (error) {
        console.log(error.message);
    }
}


// load add product page 
const loadAddProduct = async(req,res)=>{
    try {
     
      const categoryData = await Category.find()
      res.render('addProduct',{categorys:categoryData})
  
    } catch (error) {
        console.log(error.message);
    }
}
  

// to update  product name
const loadEditProduct = async(req,res)=>{
    try {
  
      const  product_id =  req.query._id;
      const productData = await Product.findOne({_id:product_id})
      res.render('editProduct',{products:[productData]})
  
    } catch (error) {
  
        console.log(error.message);
  
    }
}


// =========================================< Actions >=================================================


// to add product 
 const addProduct = async(req,res)=>{
    try {
        const img=[];

        for (let i = 0; i < req.files.length; i++) {
            img.push(req.files[i].filename);
            await Sharp("public/images/product/orginal/" + req.files[i].filename).resize(500, 500).toFile("public/images/product/sharped/" + req.files[i].filename);

        }
      const data = new Product({
        name:req.body.name,
        category:req.body.category,
        quantity:req.body.quantity,
        price:req.body.price,
        image:img,
        description:req.body.description,
        is_blocked:false
      })
  
      await data.save()
      res.redirect('/admin/product')
  
    } catch (error) {
  
        console.log(error.message);
  
    }
}


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


// to edit product
const editProduct = async (req, res) => {
  try {
    const product_id = req.query._id;
    const productData = await Product.findOne({ _id: product_id });
    const imagefileName = productData.image;


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

    await Product.findByIdAndUpdate(
      { _id: product_id },
      {
        $set: {
          name: req.body.name,
          category: req.body.category,
          quantity: req.body.quantity,
          price: req.body.price,
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
}