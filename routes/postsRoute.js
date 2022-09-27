const express = require("express")
const postsController = require("../controllers/postsController")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/", verifyToken, postsController.createPost)
router.get("/", postsController.getAllPosts)

module.exports = router

