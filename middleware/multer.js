const  multer=require('multer')

const productStorage = multer.diskStorage({

  destination: "public/images/product/orginal",

  filename: (req, file, cb)=> {

    const filename = file.originalname;
    cb(null, filename)

  }

})


const userStorage = multer.diskStorage({

  destination: "public/images/user/orginal",

  filename: (req, file, cb)=> {

    const filename = file.originalname;
    cb(null, filename)

  }

})


const bannerStorage = multer.diskStorage({

  destination: "public/images/banner/orginal",

  filename: (req, file, cb)=> {

    const filename = file.originalname;
    cb(null, filename)

  }

})


const prducts = multer({ storage: productStorage})
const user =multer({storage:userStorage})
const banner =multer({storage:bannerStorage})


module.exports = {prducts,user,banner}