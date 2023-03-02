const express =require("express");
const route = require("./src/route/route");
const dotenv = require("dotenv");
dotenv.config()
const mongoose = require("mongoose");
const app = express()

app.use(express.json())

mongoose.connect(process.env.NEWTONSTRING,
    {useNewUrlParser:true},
    mongoose.set(`strictQuery`,false))
    
    .then(()=> console.log("MongoDB is Connected"))
    .catch((error)=>console.log(error))

app.use("/",route);

app.listen(process.env.PORT || 4545, function(){
    console.log("Express app is running on Port:",(process.env.PORT || 4545))
} )
