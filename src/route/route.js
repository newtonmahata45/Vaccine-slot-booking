const express = require("express");
const router = express.Router();
const {registerUser,logIn} =require("../controller/userController")





router.post("/register", registerUser);
router.post("/login",logIn);



module.exports = router