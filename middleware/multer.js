const  multer=require('multer')

const storage = multer.diskStorage({

  destination: "public/images/product/orginal",

  filename: (req, file, cb)=> {

    const filename = file.originalname;
    cb(null, filename)

  }

})

const upload = multer({ storage: storage})

module.exports = {upload}