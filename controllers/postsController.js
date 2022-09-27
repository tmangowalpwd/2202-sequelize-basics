const db = require("../models")

Post = db.Post

const postsController = {
  createPost: async (req, res) => {
    try {
      const { body, image_url } = req.body

      await Post.create({
        body,
        image_url,
        UserId: req.user.id,
      })

      return res.status(201).json({
        message: "Post created",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const { _limit = 5, _page = 1, _sortDir = "DESC" } = req.query

      const findAllPosts = await Post.findAndCountAll({
        include: [{ model: db.User }],
        limit: Number(_limit),
        offset: (_page - 1) * _limit,
        order: [
          ["createdAt", _sortDir]
        ]
      })

      return res.status(200).json({
        message: "Get all posts",
        data: findAllPosts.rows,
        dataCount: findAllPosts.count,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

module.exports = postsController

