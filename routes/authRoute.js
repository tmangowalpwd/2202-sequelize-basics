const express = require("express")
const authController = require("../controllers/authController")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.get("/refresh-token", verifyToken, authController.refreshToken)

module.exports = router
