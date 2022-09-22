const express = require("express")
const dotenv = require("dotenv")
const db = require("./models")

dotenv.config()

const PORT = 2000

const app = express()

app.use(express.json())

app.get("/users", async (req, res) => {
  const findAllUsers = await db.User.findAll()

  res.status(200).json({
    message: "Find all users",
    data: findAllUsers
  })
})

app.listen(PORT, () => {
  db.sequelize.sync({ alter: true })
  console.log("Listening in port", PORT)
})