let jwt = require("jsonwebtoken")

let userModel = require("../model/userModel");

const { isValidObjectId} = require("../validator/validator")
const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]  // token from headers
        if (!token) {
            return res.status(400).send({ status: false, message: "token must be present in headers" })
        }
        else {
            jwt.verify(token, "secret-key-of-newton", function (err, decodedToken) {

                if (err) {
                    return res.status(401).send({ status: false, message: err.message })
                }
                else{
                    req.loginUserId = decodedToken.id       // golbelly  in  decodedToken.id 
                    next()
                }
            })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: 'Please provide a valid UserId' }) }
        let userDetail = await userModel.findById(userId)
        if (!userDetail) { return res.status(404).send({ status: false, message: 'User does not exists' }) }
        req.userDetail = userDetail
        let tokenUserId = req.loginUserId // token Id
        if (tokenUserId != userId) { return res.status(403).send({ status: false, message: "You are not authorised to perform this task" }) }
        next();
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { authenticate, authorization }