const  multer=require('multer')

const productStorage = multer.diskStorage({

  destination: "public/images/product/orginal",

  filename: (req, file, cb)=> {

    const filename = file.originalname;
    cb(null, filename)

  }

})

const prducts = multer({ storage: productStorage})

const userStorage = multer.diskStorage({

  destination: "public/images/user/orginal",

  filename: (req, file, cb)=> {

    const filename = file.originalname;
    cb(null, filename)

  }

})

const user =multer({storage:userStorage})

module.exports = {prducts,user}