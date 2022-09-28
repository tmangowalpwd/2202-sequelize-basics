const express = require("express")
const postsController = require("../controllers/postsController")
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post(
  "/",
  verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "POST",
  }).single("post_image"),
  postsController.createPost
)
router.get("/", postsController.getAllPosts)

// router.post(
//   "/upload",
//   upload({
//     acceptedFileTypes: ["png", "jpeg", "jpg"],
//     filePrefix: "GAMBAR",
//   }).single("post_image"),
//   (req, res) => {
//     res.status(200).json({
//       message: "Uploaded file",
//     })
//   }
// )

module.exports = router

