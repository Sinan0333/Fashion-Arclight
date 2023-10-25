const User = require("../model/userModel");
const Product = require('../model/productModel')
const Address = require("../model/addressModel");
const Order = require("../model/orderModel")
const Coupon = require("../model/CouponModel")


const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs")
require("dotenv").config()


let OTP;
const userData ={};
let email;


//bcrypt password
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};


// =========================================< Login Logout >=================================================


//load login page
const loadlogin = async (req, res) => {
  try {
    res.render("login");
  } catch {
    console.log(error.message);
  }
};


//user logout 
const userLogout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/login')
  } catch {
    console.log(error.message);
  }
};


//verify login
const verifyLogin = async (req,res)=>{
  try {

    const email = req.body.email
    const password = req.body.password
    const userData = await User.findOne({email:email})

    if (userData) {
       
      const matchPassword = await bcrypt.compare(password,userData.password)

      if (matchPassword) {
        if(userData.is_blocked===false){

          req.session.user_id = userData._id
          res.redirect('/')
        }else{
          res.render('login',{error:'Admin blocked you'})
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


//forgot password
const forgotPassword = async (req, res) => {
  try {
   
    if(req.session.user_id){
     const userData =await User.findOne({_id:req.session.user_id})
      sendVerifyMail(userData.name,userData.email)
      res.render('verification')
    }else{
      res.render('getEmail')
    }
  } catch {
    console.log(error.message);
  }
};


// to get email of the user to send otp to the user
const getEmail= async (req, res) => {
  try {
   
   email = req.body.email
   const userData = await User.findOne({email:email})
   if(userData){
    sendVerifyMail('user',email)
    res.render('verification')
   }else{
    res.render(getEmail,{error:'Email not found'})
   }
   
  } catch {
    console.log(error.message);
  }
};


// to change the password in db
const changePassword= async (req, res) => {
  try {
   
  if (req.session.user_id) {
    const user_id = req.session.user_id
    const sPassword = await securePassword(req.body.newpswd)
    await User.findOneAndUpdate({_id:user_id},{$set:{password:sPassword}})
    res.redirect("/profile")
  }else{
    const sPassword = await securePassword(req.body.newpswd)
    await User.findOneAndUpdate({email:email},{$set:{password:sPassword}})
    res.redirect("/login")
  }
   
  } catch {
    console.log(error.message);
  }
};


// =========================================< Signup >=================================================

//load signUp page
const loadRegister = async (req, res) => {
  try {
    res.render("signUp");
  } catch {
    console.log(error.message);
  }
};


//inserting user data when sign up
const insertUser = async (req, res) => {
  try {
    const check = await User.findOne({ email: req.body.email });
    if (check) {
      res.render("signUp", { error: "Email already exist" });
    } else {
      const sPassword = await securePassword(req.body.password)
 
      if(req.file){
        var img = req.file.originalname
      }else{
        var img = 'default.avif'
      }
      
      userData.name=req.body.username
      userData.email=req.body.email
      userData.mobile=req.body.mobile
      userData.password=sPassword
      userData.image=img
      userData.is_admin=0
      userData.is_blocked=false

      // const result = await data.save();
      sendVerifyMail(req.body.username,req.body.email)
      // req.session.user_id = result._id
      res.render("verification");
    }
  } catch (error) {
    res.send(error.message);
  }
};


//send otp to user
const sendVerifyMail = async (username, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "sinan.m.p333@gmail.com",
        pass: process.env.PASSWORD,
      },
    });

    OTP = Math.floor(1000 + Math.random() * 9000).toString();

    const mailOptions = {
      from: "sinan.m.p333@gmail.com",
      to: email,
      subject: "for verification mail",
      html: "<h1> Hi " + username + ",please verify your email " + OTP + "",
    };

    transporter.sendMail(mailOptions, (error, solve) => {
      if (error) {
        console.log(error);
      } else {
        console.log(solve.response);
      }
    });

    setTimeout(()=>{
      OTP = Math.floor(1000 + Math.random() * 9000).toString();
    },60000)

  } catch (error) {
    console.log(error.message);
  }
};


//otp verification and render home page
const otpVarification = async (req, res) => {
  try {
    const first = req.body.first;
    const second = req.body.second;
    const third = req.body.third;
    const fourth = req.body.fourth;
    const otp = first + second + third + fourth;

  if(otp!==OTP){
    res.render('verification',{error:'Otp verification failed'})
  }
  else{

    if(req.session.user_id){
      res.render('changePassword')
    }else{
      const Data = await User.findOne({email:email})
      if(Data){
        res.render('changePassword')
      }else{
        const data =new User(userData)
        const result = await data.save()
        req.session.user_id=result._id
        res.redirect("/"); 
      }
    }
  }
    
  } catch (error) {
    console.log(error.message);
  }
};


// to resend otp
const resendOtp = async (req, res) => {
  try {
    sendVerifyMail(userData.name,userData.email)
    res.render("verification");
  } catch(error) {
    console.log(error.message);
  }
};



// =========================================< Profile >=================================================

//load profile
const loadprofile = async (req, res) => {
  try {

    const user_id=req.session.user_id
    const userData =await User.findById(user_id)
    const addressData = await Address.findOne({user:user_id})
    const OrderData = await Order.find({user:user_id})
    // const couponData = await Coupon.find({is_blocked:false,usedUsers:{$nin:[user_id]},expiryDate:{$gte:new Date()}})

    const couponData = await Coupon.aggregate([
      {
        $match: {
          is_blocked: false,
          usedUsers:{$nin:[user_id]},
          expiryDate: { $gte: new Date() }
        }
      },
      {
        $addFields: {
          usedUsersCount: { $size: "$usedUsers" }
        }
      },
      {
        $match: {
          $expr: { $gt: ["$usedUsersCount", "$userLimit"] }
        }
      },
      {
        $project: {
          usedUsersCount: 0
        }
      }
    ]);

    res.render("profile",{user:userData,addresses:addressData,orders:OrderData,coupons:couponData});
  } catch {
    console.log(error.message);
  }
};


//load Editprofile Form
const loadEditProfile = async (req, res) => {
  try {
    const user_id= req.session.user_id;
    const userData = await User.findById(user_id)

    res.render("editProfile",{user:userData})
  } catch (error){
    console.log(error.message);
  }
};


//update profile
const editProfile = async (req, res) => {
  try {

    const userData = await User.findById(req.session.user_id)
// checking user changed theire password
    if(req.body.currentpswd&&req.body.newpswd){

      const matchPassword = await bcrypt.compare(req.body.currentpswd,userData.password)

      if(matchPassword){

        var sPassword = await securePassword(req.body.newpswd)

      }else{
        res.render('editProfile',{error:'Current password is incorrect.please try again.',user:userData})
      }
      
    }else{
      var sPassword = userData.password
    }

    //checking the user changed therir profile photo or not
    let img;
   if(req.file && req.file.originalname){
      img=req.file.originalname
      const imagePathOrginal = `public/images/product/orginal/${userData.image}`
      // fs.unlinkSync(imagePathOrginal)
   }else{
      img = userData.image
   }

    const data= await User.findOneAndUpdate({email:userData.email},{$set:{
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      password:sPassword,
      image:img,
      wallet:0,
      walletHistory:[]

    }}) 

    console.log(data);
    res.redirect("/profile")

  } catch (error){
    console.log(error.message);
  }
};


//load Smple
const sample = async (req, res) => {
  try {
    
    res.render("S")
  } catch (error){
    console.log(error.message);
  }
};









module.exports = {
  insertUser,
  loadRegister,
  otpVarification,
  loadlogin,
  verifyLogin,
  forgotPassword,
  getEmail,
  changePassword,
  userLogout,
  resendOtp,
  loadprofile,
  loadEditProfile,
  editProfile,
  sample,


};
