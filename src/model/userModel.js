const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    pincode: { type: Number, required: true },
    aadharNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstDose: { type: Date, default: null },
    secondDose: { type: Date, default: null }

},{timestamps:true})




module.exports = mongoose.model("User",userSchema)