const express = require("express")
const dotenv = require("dotenv")
const db = require("./models")
const { Op } = require("sequelize")

dotenv.config()

const PORT = 2000

const app = express()

app.use(express.json())

app.get("/users", async (req, res) => {
  try {
    const findAllUsers = await db.User.findAll({
      where: {
        ...req.query,
        username: {
          [Op.like]: `%${req.query.username || ""}%`,
        },
        // [Op.or]: {
        //   username: req.query.username,
        //   email: req.query.email
        // }
      },
      attributes: {
        exclude: ["id", "username"],
      },
    })

    return res.status(200).json({
      message: "Find all users",
      data: findAllUsers,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

app.post("/users", async (req, res) => {
  try {
    const createUser = await db.User.create({ ...req.body })

    return res.status(201).json({
      message: "Created user",
      data: createUser,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

app.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    const findUser = await db.User.findByPk(id)

    if (!findUser) {
      return res.status(400).json({
        message: "User with ID not found",
      })
    }

    await db.User.update(req.body, {
      where: {
        id: id,
      },
    })

    // UPDATE Users SET email = "test123@mail.com" WHERE id = 1

    return res.status(200).json({
      message: "Updated user",
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    await db.User.destroy({
      where: {
        id: id,
      },
    })

    return res.status(200).json({
      message: "Deleted user",
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    const findUserById = await db.User.findByPk(id, {
      include: [{ model: db.Expense }],
    })

    return res.status(200).json({
      message: "Find user by ID",
      data: findUserById,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

app.post("/users/register", async (req, res) => {
  try {
    const { email, username, password, passwordConfirm } = req.body

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password needs more than 8 characters",
      })
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        message: "Password does not match",
      })
    }

    const findUserByUsernameOrEmail = await db.User.findOne({
      where: {
        [Op.or]: {
          username: username,
          email: email,
        },
      },
    })

    if (findUserByUsernameOrEmail) {
      return res.status(400).json({
        message: "Username or email has been taken",
      })
    }

    await db.User.create({
      username,
      email,
      password,
    })

    return res.status(201).json({
      message: "User registered",
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

app.listen(PORT, () => {
  db.sequelize.sync({ alter: true })
  console.log("Listening in port", PORT)
})
