const Address = require("../model/addressModel");
const User = require("../model/userModel");


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

        res.redirect('/profile')

    } catch(error) {

      console.log(error.message);

    }
};



//Edit Address



module.exports ={
 addAddress,
}