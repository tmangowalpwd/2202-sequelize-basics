const express = require("express")
const authController = require("../controllers/authController")
const { verifyToken } = require("../middlewares/authMiddleware")
const { body } = require("express-validator")

const router = express.Router()

router.post(
  "/register",
  body(
    "username",
    "Username length has to be min 3, and only contain alphanumeric chars"
  )
    .isLength({ min: 3 })
    .isAlphanumeric(),
  body("email").isEmail(),
  body("password").isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
    minLowercase: 1,
  }),
  authController.registerUser
)
router.post("/login", authController.loginUser)
router.get("/refresh-token", verifyToken, authController.refreshToken)

module.exports = router

