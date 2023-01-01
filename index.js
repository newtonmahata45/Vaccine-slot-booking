const express =require("express");
const route = require("./src/route/route");

const mongoose = require("mongoose");
const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://newton45:Rohit.45@cluster0.zs6mwy3.mongodb.net/VaccineSlotBooking",
    {useNewUrlParser:true},
    mongoose.set(`strictQuery`,false))
    .then(()=> console.log("MongoDB is Connected"))
    .catch((error)=>console.log(error))

app.use("/",route);

app.listen(process.env.PORT || 3000, function(){
    console.log("Express app is running on Port:",(process.env.PORT || 3000))
} )
