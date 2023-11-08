const Category = require('../model/categoryModel')



// load categoryManagement page dynamically
const loadCategoryManagement = async(req,res)=>{
    try {

      const categoryData = await Category.find()
      res.render('categoryManagement',{categorys:categoryData})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}
  
  
// to add category 
const addCategory = async(req,res)=>{
    try {

      const categoryName=req.body.categoryName
      const categoryData= await Category.find({name:categoryName})

      if(categoryData.length>0){
        res.redirect('/admin/category')
  
      }else{
        const data =new Category({
  
          name:categoryName,
          is_blocked:false
    
        })
        const result = await data.save();
        console.log("after saving");
        res.redirect('/admin/category')
  
      } 
  
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}
  
  
// to block category 
const blockCategory = async(req,res)=>{
    try {
  
      const  category_id =  req.query._id
      const categoryData = await Category.findOne({_id:category_id})
      
      if(categoryData.is_blocked){
       await Category.findByIdAndUpdate({_id:category_id},{$set:{is_blocked:false}}) 
      }else{  
        await Category.findByIdAndUpdate({_id:category_id},{$set:{is_blocked:true}})
      }
  
      res.redirect('/admin/category')
  
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
  
}
  
  
// to update  category name
const updateCategory = async(req,res)=>{
    try {
  
      const  category_id =  req.query._id;
      const categoryName =req.body.categoryName
  
      await Category.findByIdAndUpdate({_id:category_id},{$set:{name:categoryName}}) 
  
      res.redirect('/admin/category')
  
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


module.exports ={
    loadCategoryManagement,
    addCategory,
    blockCategory,
    updateCategory,
}