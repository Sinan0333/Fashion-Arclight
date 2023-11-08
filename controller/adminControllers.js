const User = require("../model/userModel");
const Order = require("../model/orderModel")
const Banner = require("../model/bannerModel");
const Category = require('../model/categoryModel')
const Coupon = require('../model/CouponModel');
const Offer = require("../model/offerModel")
const Product = require('../model/productModel')
const bcrypt = require("bcrypt");
const puppeteer = require('puppeteer')
const ExcelJS = require('exceljs')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs');



// =========================================< Dashboard >=================================================


//load admin Dashboard
const loadDashboard = async (req,res)=>{
    try {

      let data=[];
      let ind=0
      const currentDate = new Date();
      const startDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
      const userData = await User.find()
      const usersCount = userData.length
      let soldProducts=0
      const orderData =await Order.find({ date: { $gte: startDate, $lt: currentDate }})
      const revenue = orderData ? orderData.reduce((acc, val) => (val.status === 'delivered' ? acc + val.totalAmount : acc), 0) : 0
      const totalOrders = orderData ? orderData.length : 0
      const deliveredOrders = orderData ? orderData.reduce((acc,val)=> (val.status === 'delivered' ? acc + 1: acc), 0) : 0
      const cancelledOrders = orderData ? orderData.reduce((acc,val)=> (val.status === 'cancel' ? acc + 1: acc), 0) : 0
    
      if(orderData){
        for(let i=0;i<orderData.length;i++){
            let soldCount = orderData[i].products.reduce((acc,val)=>acc+val.count,0)
            soldProducts+=soldCount
        }
      }
     
      const monthlyOrderCounts = await Order.aggregate([
        {
          $match: {
            status: 'delivered',
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%m', date: '$date' } },
            count: { $sum: 1 },
          },
        },
      ])

      if(monthlyOrderCounts.length !=0){
        for(let i=0;i<12;i++){

          if(i+1<monthlyOrderCounts[0]._id){
            data.push(0)
          }else{
            if( monthlyOrderCounts[ind]){
              let count = monthlyOrderCounts[ind].count
              data.push(count)
            }else{
              data.push(0)
            }
            ind++
          }
        }
      }
     
      const paymentMethodsData = await Order.aggregate([
        {
          $match: {
            status: 'delivered',
          },
        },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
          },
        },
      ])


        res.render('dashboard',{
          data,
          paymentMethodsData,
          revenue,
          soldProducts,
          usersCount,
          totalOrders,
          deliveredOrders,
          cancelledOrders,
        })

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}



// =========================================< Lgin,Logout >=================================================


//load admin login page
const loadlogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


//admin logout
const adminLogout = async(req,res)=>{
  try {
    req.session.admin_id=false
    res.redirect('/admin/login')
  } catch (error) {
      console.log(error.message);
      res.render('500Error')
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
      res.render('500Error')
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
      res.render('500Error')
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
      res.render('500Error')
  }
}


// =========================================< Sales Report >=================================================
const salesReport = async (req, res) => {
  try {
    const duration = req.query.sort;
    const currentDate = new Date();
    const startDate = new Date(currentDate - duration * 24 * 60 * 60 * 1000);

    const orders = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          status: "delivered",
          date: { $gte: startDate, $lt: currentDate },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $lookup: {
          from: "products",
          let: { productId: { $toObjectId: "$products.productId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
          as: "products.productDetails",
        },
      },
      {
        $addFields: {
          "products.productDetails": {
            $arrayElemAt: ["$products.productDetails", 0],
          },
        },
      },
    ]);

    res.render('salesReport', { orders });
  } catch (error) {
    console.log(error.message);
    res.render('500Error')
  }
};


// To download sales report
const downloadReport = async (req, res) => {
  try {
    const { duration, format } = req.query;
    const currentDate = new Date();
    const startDate = new Date(currentDate - 1 * 24 * 60 * 60 * 1000);
    const orders = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          status: "delivered",
          
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $lookup: {
          from: "products",
          let: { productId: { $toObjectId: "$products.productId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
          as: "products.productDetails",
        },
      },
      {
        $addFields: {
          "products.productDetails": {
            $arrayElemAt: ["$products.productDetails", 0],
          },
        },
      },
    ]);
    const date = new Date()
    data = {
      orders,
      date,
    }

    if (format === 'pdf') {
      const filepathName = path.resolve(__dirname, "../views/admin/ReportPdf.ejs");

      const html = fs.readFileSync(filepathName).toString();
      const ejsData = ejs.render(html, data);

      const browser = await puppeteer.launch({ headless: "new"});
      const page = await browser.newPage();
      await page.setContent(ejsData, { waitUntil: "networkidle0"});
      const pdfBytes = await page.pdf({ format: "letter" });
      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename= Sales Report.pdf"
    );
    res.send(pdfBytes);
    } else if (format === 'excel') {
      // Generate and send an Excel report
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales Report');

      // Add data to the Excel worksheet (customize as needed)
      worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 8 },
        { header: 'Product Name', key: 'productName', width: 50 },
        { header: 'Qty', key: 'qty', width: 5 },
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Customer', key: 'customer', width: 15 },
        { header: 'Total Amount', key: 'totalAmount', width: 12 },
      ];
      // Add rows from the reportData to the worksheet
      orders.forEach((data) => {
        worksheet.addRow({
          orderId: data._id,
          productName: data.products.productDetails.name,
          qty: data.products.count,
          date: data.date.toLocaleDateString('en-US', { year:
            'numeric', month: 'short', day: '2-digit' }).replace(/\//g,
            '-'),
          customer: data.deliveryDetails.fullName,
          totalAmount: data.products.totalPrice,
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${duration}_sales_report.xlsx`);
      const excelBuffer = await workbook.xlsx.writeBuffer();
      res.end(excelBuffer);
    } else {
      // Handle invalid format
      res.status(400).send('Invalid format specified');
    }
  } catch (error) {
    console.log(error.message);
    res.render('500Error')
  }
};


// admin seach
const adminSeach = async(req,res)=>{
  try {

    const search =req.query.search
    const previousUrl = req.get('referer');
    const spliturl = previousUrl.split('/')

    if(spliturl.includes('user')){

      const userData = await User.find({
        name:{ $regex:search, $options:'i'}
      })
      res.render('userManagement',{users:userData})
      
    }else if(spliturl.includes('category')){

      const categoryData = await Category.find({
        name:{ $regex:search, $options:'i'}
      })
      res.render('categoryManagement',{categorys:categoryData})

    }else if(spliturl.includes('product')){

      const productData = await Product.find({
        name:{ $regex:search, $options:'i'}
      })
      res.render('productManagement',{products:productData})

    }else if(spliturl.includes('order')){

      const OrderData = await Order.find({
        name:{ $regex:search, $options:'i'}
      })
      res.render('orderManagement',{orders:OrderData})

    }else if(spliturl.includes('banner')){

      const bannerData = await Banner.find({
        title:{ $regex:search, $options:'i'}
      })
      res.render('bannerManagement',{banners:bannerData})

    }else if(spliturl.includes('coupon')){

      const couponData = await Coupon.find({
        name:{ $regex:search, $options:'i'}
      })
      res.render('couponManagement',{coupons:couponData})

    }
    else if(spliturl.includes('offer')){

      const offerData = await Offer.find({
        name:{ $regex:search, $options:'i'}
      })
      res.render('offerManagement',{offers:offerData})
      
    }else{
      const productData = await Product.find({
        name:{ $regex:search, $options:'i'}
      })
      res.render('productManagement',{products:productData})
    }
  
  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}

module.exports ={
    loadlogin,
    verifyLogin,
    loadDashboard,
    loadUserManagement,
    blockUser,
    adminLogout,
    salesReport,
    downloadReport,
    adminSeach
}