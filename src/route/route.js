const express = require("express");
const router = express.Router();
const { registerUser, logIn } = require("../controller/userController")
const { slotReg, updateSlot, getByAdmin, availableSlots } = require("../controller/vaccineController")
const {authenticate,authorization} =require("../middleware/auth")



router.post("/register", registerUser);
router.post("/login", logIn);
router.post("/register/:userId/:doseNo",authenticate,authorization, slotReg);
router.put("/update/:userId/:doseNo",authenticate,authorization, updateSlot);
router.get("/admin/:userId",authenticate,authorization, getByAdmin);
router.get("/availableSlots",authenticate, availableSlots);


module.exports = router