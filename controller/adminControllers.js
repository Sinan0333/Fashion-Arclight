const User = require("../model/userModel");
const bcrypt = require("bcrypt");



// =========================================< Dashboard >=================================================


//load admin Dashboard
const loadDashboard = async (req,res)=>{
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message);
    }
}


// =========================================< Lgin,Logout >=================================================


//load admin login page
const loadlogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}


//admin logout
const adminLogout = async(req,res)=>{
  try {
    req.session.destroy()
    res.redirect('/admin/login')
  } catch (error) {
      console.log(error.message);
  }
}


//verify admin login
const verifyLogin = async (req,res)=>{
    try {
  
      const email = req.body.email
      const password = req.body.password
      const adminData = await User.findOne({email:email})
  
      if (adminData) {
         
        const matchPassword = await bcrypt.compare(password,adminData.password)
  
        if (matchPassword) {
          
            if(adminData.is_admin===1){
                req.session.admin_id = adminData._id
                res.redirect('/admin')
            }else{
                res.render('login',{error:'Email not found'})
            }
          
        } else {
          res.render('login',{error:'incorrect password'})
        }
        
      }else{
        res.render('login',{error:'Email not found'})
      }
  
    } catch (error) {
      console.log(error.message);
    }
  }


// =========================================< User Management >=================================================


// load userManagement page dynamically
const loadUserManagement = async(req,res)=>{
  try {

      const userData = await User.find({is_admin:0})
      res.render('userManagement',{users:userData})
  } catch (error) {
      console.log(error.message);
  }
}

// to block user
const blockUser = async(req,res)=>{
  try {

    const user_id =  req.body.userId
    const userData = await User.findOne({_id:user_id})

    if(userData.is_blocked){
     await User.findByIdAndUpdate({_id:user_id},{$set:{is_blocked:false}}) 
    }else{  
      await User.findByIdAndUpdate({_id:user_id},{$set:{is_blocked:true}})
    }

    res.json({block:true}) 

  } catch (error) {

      console.log(error.message);

  }
}



module.exports ={
    // loadSample,
    loadlogin,
    verifyLogin,
    loadDashboard,
    loadUserManagement,
    blockUser,
    adminLogout,
}