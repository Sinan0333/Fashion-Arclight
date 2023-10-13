const User = require("../model/userModel");
const isLogin = async (req,res,next)=>{

    try {
        
        if(req.session.user_id){
            const userData = await User.findById(req.session.user_id)
            if(userData.is_blocked){
                res.redirect('/login')
            }else{
                next();
            }   
        }else{
            res.redirect('/login')
        }
        
    } catch (error) {
        
        console.log(error.message);

    }
}


const isLogout = async (req,res,next)=>{

    try {
        
        if (req.session.user_id) {
            const userData = await User.findById(req.session.user_id)
            if(userData.is_blocked){
                next();
            }else{
                res.redirect('/')
            }
        } else {
            next();
        }
        
    } catch (error) {
        
        console.log(error.message);

    }
}

module.exports= {
    isLogin,
    isLogout,
}