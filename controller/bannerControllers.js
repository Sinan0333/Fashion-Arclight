const Banner = require("../model/bannerModel");
const fs = require("fs")


//load Banner Mangement
const loadBannerManagement = async (req,res)=>{
    try {
        const bannerData = await Banner.find()
        
        res.render('bannerManagement',{banners:bannerData})
    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


//load Add Banner 
const loadAddBanner = async (req,res)=>{
    try {
        
        res.render('addBanner')

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Add Banner 
const addBanner = async (req,res)=>{
    try {
        
        const data = new Banner({
            title:req.body.title,
            description:req.body.description,
            image:req.file.originalname,
            is_blocked:false
        })

        await data.save()
        res.redirect('/admin/banner')

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Delete Banner 
const deleteBanner = async (req,res)=>{
    try {

        const bannerId = req.body._id
        await Banner.findOneAndDelete({_id:bannerId})
        res.json({delete:true})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Block Banner 
const blockBanner = async (req,res)=>{
    try {

        const bannerId = req.body._id
        const bannerData = await Banner.findById(bannerId)
        if(bannerData.is_blocked===true){
            await Banner.findOneAndUpdate({_id:bannerId},{$set:{is_blocked:false}})
        }else{
            await Banner.findOneAndUpdate({_id:bannerId},{$set:{is_blocked:true}})
        }
        res.json({block:true})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Load Edit Banner Form  
const loadEditBanner = async (req,res)=>{
    try {

        const bannerId = req.query._id
        const bannerData = await Banner.findById(bannerId)
        res.render("editBanner",{banner:bannerData})

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


// Edit Banner 
const editBanner = async (req,res)=>{
    try {
        
        let image;
        const bannerId = req.query._id
        const bannerData = await Banner.findById(bannerId)

        if(req.file && req.file.originalname){
            image=req.file.originalname
            const imagePathOrginal = `public/images/banner/orginal/${bannerData.image}`
            fs.unlinkSync(imagePathOrginal)
         }else{
            image = bannerData.image
         }

        await Banner.findOneAndUpdate({_id:bannerId},
            {
                title:req.body.title,
                description:req.body.description,
                image:image

            })

        res.redirect("/admin/banner")

    } catch (error) {
        console.log(error.message);
        res.render('500Error')
    }
}


module.exports ={
    loadBannerManagement,
    loadAddBanner,
    addBanner,
    deleteBanner,
    blockBanner,
    loadEditBanner,
    editBanner
}