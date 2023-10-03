const mongoose =  require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/FashionArclight')
require("dotenv").config()
// ...........................................................

const express = require('express')
const app = express()
const noCache = require('nocache')

const userRoute= require('./routes/userRoute')
const adminRoute= require('./routes/adminRoute')

app.use(express.static('public'))
app.use(noCache())

app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use((req, res) => {
    res.status(404).render(__dirname+'/views/user/Error.ejs');
  });


app.listen(3000,()=>{
    console.log("Server is runnig...")
})                      