const Coupon = require('../model/CouponModel');


// load Coupon Management
const loadCouponManagement = async(req,res)=>{
    try {

      const couponData = await Coupon.find()
      res.render('couponManagement',{coupons:couponData})
      
    } catch (error) {
        console.log(error.message);
    }
}


// load Add Coupon 
const loadAddCoupon= async(req,res)=>{
    try {

        res.render("addCoupon")
        
    } catch (error) {
        console.log(error.message);
    }
}


// Add Coupon
const addCoupon = async (req,res)=>{
    try {
        const data = new Coupon({
            name:req.body.name,
            couponCode:req.body.code,
            discountAmount:req.body.discount,
            activationDate:new Date(),
            expiryDate:req.body.expiryDate,
            criteriaAmount:req.body.criteriAamount,
            usersLimit:req.body.userLimit,
        })
        await data.save()
        res.redirect('/admin/coupon')
    } catch (error) {
        console.log(error.message);
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
    }
}


// Edit Banner 
const editCoupon = async (req,res)=>{
    try {

        const couponId = req.query._id
        const couponData = await Coupon.findById(couponId)

        await Coupon.findOneAndUpdate({_id:couponId},
            {
                name:req.body.name,
                couponCode:req.body.code,
                discountAmount:req.body.discount,
                expiryDate:req.body.expiryDate,
                criteriaAmount:req.body.criteriAamount,
                usersLimit:req.body.userLimit,

            })

        res.redirect("/admin/coupon")

    } catch (error) {
        console.log(error.message);
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
    }
}


// check User entred coupon
const checkCoupon = async (req,res)=>{
    try {

        const couponCode = req.body.coupon
        const user_id = req.session.user_id
        const couponData = await Coupon.find()
        const findCoupon = couponData.filter((obj)=>obj.couponCode==couponCode)

        if(findCoupon){
            const usedUSer = couponData.usedUsers.filter((user)=>user==user_id)
            if(usedUSer){

            }else{
                
            }
        }


    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
   loadCouponManagement,
   loadAddCoupon,
   addCoupon,
   loadEditCoupon,
   editCoupon,
   blockCoupon,
   deleteCoupon
}