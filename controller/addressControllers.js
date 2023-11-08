const Address = require("../model/addressModel");
const User = require("../model/userModel");


// Load ADD Address
const loadAddAddress = async(req,res)=>{
  try {

    res.render("addAddress");

  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}


//Add address
const addAddress = async (req, res) => {
    try {

        const user_id=req.session.user_id
        const data = {
            fullName:req.body.name,
            mobile:req.body.mobile,
            email:req.body.email,
            houseName:req.body.house,
            state:req.body.state,
            city:req.body.city,
            pin:req.body.pincode,
        }

        await Address.findOneAndUpdate(

            { user: user_id },
            {
              $set: { user: user_id },
              $push: { address: data }
            },
            { upsert: true, new: true }

          );

        res.json({add:true})
        
    } catch(error) {
      console.log(error.message);
      res.render('500Error')
    }
};


// Load Edit Address
const loadEditAddress = async(req,res)=>{
  try {
    const user_id = req.session.user_id
    const ind = req.query.ind

    const userData = await Address.findOne({user:user_id})
    const address = userData.address[ind]

    res.render("editAddress",{edit:address,user_id});

  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}


//  to update address
const editAddress = async(req,res)=>{
  try {

     const user_id=req.session.user_id

    await Address.updateOne({user:user_id,'address._id':req.body._id},
    {
      $set:{
        'address.$.fullName':req.body.name,
        'address.$.mobile':req.body.mobile,
        'address.$.houseName':req.body.house,
        'address.$.state':req.body.state,
        'address.$.city':req.body.city,
        'address.$.pin':req.body.pincode,

      }
    })

    res.redirect("/profile");

  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}


//  to delete address
const deleteAddress = async(req,res)=>{
  try {
    
     const user_id=req.session.user_id
     const address_id = req.body._id

     await Address.updateOne({user:user_id},{$pull:{address:{_id:address_id}}})

    res.json({add:true})

  } catch (error) {
      console.log(error.message);
      res.render('500Error')
  }
}


module.exports ={
 loadAddAddress,
 addAddress,
 loadEditAddress,
 editAddress,
 deleteAddress
}