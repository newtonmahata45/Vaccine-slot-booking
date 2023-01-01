const bcrypt = require("bcrypt")


const registerUser = async function (req, res) {
    try {
        const data = req.body
        const { name, phoneNumber, age, password ,aadharNo,pincode } = data

    //===========================validation for Key and Value present or Not=============================================// 

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "plz provide data" })
        if (!name) { return res.status(400).send({ status: false, message: "name is mandatory" }) }
        if (!phoneNumber) { return res.status(400).send({ status: false, message: "phone no is mandatory" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }
        if (!age) { return res.status(400).send({ status: false, message: "age is mandatory" }) }
        if (!pincode) { return res.status(400).send({ status: false, message: "pincode is mandatory" }) }
        if (!aadharNo) { return res.status(400).send({ status: false, message: "aadharNo is mandatory" }) }

    //==============================validation by using Regex=============================================================// 

        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Plz provied a valid name" })
        if (!forName(name)) return res.status(400).send({ status: false, message: "name should be valid and starts with Capital letter" })
        if (!isValidPhone(phoneNumber)) return res.status(400).send({ status: false, message: "phone no is not valid" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Choose a Strong Password,Use a mix of letters (uppercase and lowercase), numbers, and symbols in between 8-15 characters" })
        if (!isNumber(age)) return res.status(400).send({ status: false, message: "Put age in Numbers" })
        if (!isNumber(pincode)) return res.status(400).send({ status: false, message: "Put pincode in Numbers" })
        if (!isValidAadhar(aadharNo)) return res.status(400).send({ status: false, message: "aadharNo is not valid" })

    //==========================================================================================================================//


        let uniquePhn = await userModel.findOne({ phoneNumber: phoneNumber })   // checking Phone Number is Unique or not //
        if (uniquePhn) return res.status(409).send({ status: false, message: "phoneNumber is already registered" })
        let uniqueAadhar = await userModel.findOne({ aadharNo: aadharNo })   // checking Phone Number is Unique or not //
        if (uniqueAadhar) return res.status(409).send({ status: false, message: "aadharNo is already registered" })

        let userData = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'Register Successfull', data: userData })     // Data is Create Successfully
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


let logIn = async function (req, res) {
    try {
        let credentials = req.body
        let { phoneNumber, password } = credentials
        if (Object.keys(credentials).length == 0) {
            return res.status(400).send({ status: false, message: "phoneNumber and password are required for Log in" })
        }
        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }
        if (!phoneNumber) { return res.status(400).send({ status: false, message: "phoneNumber is mandatory" }) }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "password is not valid" })
        }
        if (!isValidPhone(phoneNumber)) return res.status(400).send({ status: false, message: "phone no is not valid" })
        let userDetail = await userModel.findOne({ phoneNumber: phoneNumber })
        if (!userDetail) {
            return res.status(404).send({ status: false, message: "User not found with this Phone Number" })
        }
        let passwordHash = userDetail.password;
        const passwordMatch = await bcrypt.compare(password, passwordHash)
        if (!passwordMatch) {
            return res.status(400).send({ status: false, message: "Password dose not match with Phone Number" })
        }
        let token = jwt.sign({
            userId: userDetail._id.toString(),

        }, "secret-key-of-newton")
        res.setHeader("x-api-key", token)

        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: userDetail._id, token: token } })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

module.exports = {registerUser,logIn}