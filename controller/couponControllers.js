const { coupon } = require('../middleware/multer');
const Coupon = require('../model/CouponModel');
const Cart = require('../model/cartModel')


// load Coupon Management
const loadCouponManagement = async(req,res)=>{
    try {

      const couponData = await Coupon.find()
      res.render('couponManagement',{coupons:couponData})
      
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// load Add Coupon 
const loadAddCoupon= async(req,res)=>{
    try {

        res.render("addCoupon")
        
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Add Coupon
const addCoupon = async (req,res)=>{
    try {

        const couponData = await Coupon.findOne({couponCode:req.body.code})

        if(couponData){
            res.render("addCoupon",{error:'coupon code already exist'})
        }else{
            const data = new Coupon({
                name:req.body.name,
                couponCode:req.body.code,
                discountAmount:req.body.discount,
                activationDate:req.body.activationDate,
                expiryDate:req.body.expiryDate,
                criteriaAmount:req.body.criteriAamount,
                usersLimit:req.body.userLimit,
            })

            await data.save()
            res.redirect('/admin/coupon')
        }
       
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Load Edit Coupon Form
const loadEditCoupon = async (req,res)=>{
    try {
       
        const couponId = req.query._id;
        const couponData = await Coupon.findById(couponId)
        res.render("editCoupon",{coupon:couponData})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Edit Banner 
const editCoupon = async (req,res)=>{
    try {

        const couponId = req.query._id
        const couponData = await Coupon.findOne({couponCode:req.body.code})

        if(couponData){
            res.render("editCoupon",{error:'coupon code already exist'})
        }else{
            await Coupon.findOneAndUpdate({_id:couponId},
                {
                    name:req.body.name,
                    couponCode:req.body.code,
                    discountAmount:req.body.discount,
                    activationDate:req.body.activationDate,
                    expiryDate:req.body.expiryDate,
                    criteriaAmount:req.body.criteriAamount,
                    usersLimit:req.body.userLimit,
    
                })
    
            res.redirect("/admin/coupon")
        }

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Block Coupon 
const blockCoupon = async (req,res)=>{
    try {

        const couponId = req.body._id
        const couponData = await Coupon .findById(couponId)

        if(couponData.is_blocked===true){
            await Coupon.findOneAndUpdate({_id:couponId},{$set:{is_blocked:false}})
        }else{
            await Coupon.findOneAndUpdate({_id:couponId},{$set:{is_blocked:true}})
        }
        res.json({block:true})
        
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Delete Coupon 
const deleteCoupon = async (req,res)=>{
    try {
        const couponId = req.body._id
        await Coupon.findOneAndDelete({_id:couponId})
        res.json({delete:true})
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// check User entred coupon
const checkCoupon = async (req,res)=>{
    try {

        const couponCode = req.body.coupon
        const user_id = req.session.user_id
        const currentDate = new Date()
        const couponData = await Coupon.findOne({couponCode:couponCode})
        const cartData = await Cart.findOne({user:user_id})
        const cartTotal = cartData.products.reduce((acc,val)=>acc+val.totalPrice,0)
        if(couponData && couponData.is_blocked==false){
            if(currentDate >= couponData.activationDate && currentDate <= couponData.expiryDate){
                if (couponData.usedUsers.length < couponData.usersLimit) {
                    const exists = couponData.usedUsers.includes(user_id)
                    if(!exists){
                        if(cartTotal>=couponData.criteriaAmount){
                            await Coupon.findOneAndUpdate({couponCode:couponCode},{$push:{usedUsers:user_id}})
                            await Cart.findOneAndUpdate({user:user_id},{$set:{couponDiscount:couponData._id}})
                            res.json({coupon:true})
                        }else{
                            res.json({coupon:'amountIssue'})
                        }
                        
                    }else{
                        res.json({coupon:'used'})
                    }
                  }else{
                    res.json({coupon:'limit'})
                  } 
            }else{
                res.json({coupon:'notAct'})
            }
        }else{
            res.json({coupon:false})
        }


    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Remove Coupon 
const removeCoupon = async (req,res)=>{
    try {
        const user_id = req.session.user_id
        const cartData = await Cart.findOne({user:user_id})
        const couponData = await Coupon.findOneAndUpdate({_id:cartData.couponDiscount},{$pull:{usedUsers:user_id}})
        const updateCart = await Cart.findOneAndUpdate({user:user_id},{$set:{couponDiscount:0}})
        res.json({remove:true})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}
module.exports ={
   loadCouponManagement,
   loadAddCoupon,
   addCoupon,
   loadEditCoupon,
   editCoupon,
   blockCoupon,
   deleteCoupon,
   checkCoupon,
   removeCoupon,
}