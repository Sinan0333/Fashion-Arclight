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


const couponStorage = multer.diskStorage({

  destination: "public/images/coupon/orginal",

  filename: (req, file, cb)=> {

    const filename = file.originalname;
    cb(null, filename)

  }

})


const prducts = multer({ storage: productStorage})
const uploadProduct = prducts.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);
const user =multer({storage:userStorage})
const banner =multer({storage:bannerStorage})
const coupon =multer({storage:couponStorage})


module.exports = {uploadProduct,user,banner,coupon}