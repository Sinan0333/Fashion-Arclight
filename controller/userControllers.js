const User = require("../model/userModel");
const Product = require('../model/productModel')
const Address = require("../model/addressModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config()


let OTP;
const userData ={};


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
      // const data = new User({
      //   name: req.body.username,
      //   email: req.body.email,
      //   mobile: req.body.mobile,
      //   password: sPassword,
      //   is_admin:0,
      //   is_blocked:false
      // });
      userData.name=req.body.username
      userData.email=req.body.email
      userData.mobile=req.body.mobile
      userData.password=sPassword
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
    res.render('signUp')
    // res.render("index");
  }
  else{

    const data =new User(userData)
    const result = await data.save()
    req.session.user_id=result._id
    res.redirect("/"); 

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



// =========================================< Load pages >=================================================


// load home page (index.js)
const loadHome = async (req, res) => {
  try {

    const productData = await Product.find()
    res.render("index",{products:productData});
  } catch {
    console.log(error.message);
  }
};


//load product page
const loadProduct = async (req, res) => {
  try {
    const product_id=req.query._id
    const productData = await Product.findOne({_id:product_id})

    const relatedProducts =await Product.find({category:productData.category})
    res.render("product",{product:productData,relatedProducts:relatedProducts});
  } catch {
    console.log(error.message);
  }
};



const loadprofile = async (req, res) => {
  try {

    const user_id=req.session.user_id
    const userData =await User.findById(user_id)
    const addressData = await Address.findOne({user:user_id})

    res.render("profile",{user:userData,addresses:addressData});
  } catch {
    console.log(error.message);
  }
};







module.exports = {
  insertUser,
  loadRegister,
  loadHome,
  otpVarification,
  loadlogin,
  verifyLogin,
  loadProduct,
  userLogout,
  resendOtp,
  loadprofile

};
