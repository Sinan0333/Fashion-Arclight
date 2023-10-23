const Offer = require("../model/offerModel")
const Category = require('../model/categoryModel')


// load Offer Management
const loadOfferrManagement = async(req,res)=>{
    try {

      const offerData = await Offer.find()
      res.render('offerManagement',{offers:offerData})
      
    } catch (error) {
        console.log(error.message);
    }
}


// load Add Offer 
const loadAddOffer = async(req,res)=>{
    try {

        res.render("addOffer")
        
    } catch (error) {
        console.log(error.message);
    }
}


// Add Offer
const addOffer = async (req,res)=>{
    try {

        const data = new Offer({
            name:req.body.name,
            discountAmount:req.body.discount,
            activationDate:req.body.activationDate,
            expiryDate:req.body.expiryDate,
        })

       const offerData =  await data.save()
        res.redirect('/admin/offer')

    } catch (error) {
        console.log(error.message);
    }
}


// Load Edit Offer Form
const loadEditOffer = async (req,res)=>{
    try {
       
        const offerId = req.query._id;
        const offerData = await Offer.findById(offerId)
        res.render("editOffer",{offer:offerData})

    } catch (error) {
        console.log(error.message);
    }
}


// Edit Offer
const editOffer = async (req,res)=>{
    try {

        const offerId = req.query._id
        const offerData = await Offer.findById(offerId)

        await Offer.findOneAndUpdate({_id:offerId},
            {
                name:req.body.name,
                discountAmount:req.body.discount,
                activationDate:req.body.activationDate,
                expiryDate:req.body.expiryDate,
            })

        res.redirect("/admin/offer")

    } catch (error) {
        console.log(error.message);
    }
}


// Block Offer 
const blockOffer = async (req,res)=>{
    try {
        const offerId = req.body._id
        const offerData = await Offer .findById(offerId)
        if(offerData.is_blocked===true){
            await Offer.findOneAndUpdate({_id:offerId},{$set:{is_blocked:false}})
        }else{
            await Offer.findOneAndUpdate({_id:offerId},{$set:{is_blocked:true}})
        }
        res.json({block:true})
    } catch (error) {
        console.log(error.message);
    }
}


// Delete Offer
const deleteOffer = async (req,res)=>{
    try {
        const offerId = req.body._id
        await Offer.findOneAndDelete({_id:offerId})
        res.json({delete:true})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
  loadOfferrManagement,
  loadAddOffer,
  addOffer,
  loadEditOffer,
  editOffer,
  blockOffer,
  deleteOffer,
}