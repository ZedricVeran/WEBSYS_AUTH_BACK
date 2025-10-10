const express = require("express")
const router = express.Router()
const userController = require("./user-controllers")

router.post('/', userController.loginUser)

module.exports = router