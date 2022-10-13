const express = require("express")
const dotenv = require("dotenv")
const db = require("./models")
const cors = require("cors")
const fs = require("fs")

dotenv.config()

const PORT = 2000

const app = express()
app.use(cors())
app.use(express.json())

const expensesRoute = require("./routes/expensesRoute")
const authRoute = require("./routes/authRoute")
const postsRoute = require("./routes/postsRoute")
const transactionsRoute = require("./routes/transactionsRoute")

const { verifyToken } = require("./middlewares/authMiddleware")

app.use("/expenses", verifyToken, expensesRoute)
app.use("/auth", authRoute)
app.use("/posts", postsRoute)
app.use("/transactions", verifyToken, transactionsRoute)

app.use("/public", express.static("public"))

const axios = require("axios")
const redisClient = require("./lib/redis")

app.get("/dogs/:breed", async (req, res) => {
  try {
    const { breed } = req.params

    const cacheResult = await redisClient.get(breed)

    if (cacheResult) {
      return res.status(200).json({
        message: "Fetch dogs API",
        data: JSON.parse(cacheResult)
      })
    }

    const response = await axios.get(
      `https://dog.ceo/api/breed/${breed}/images`
    )

    await redisClient.setEx(breed, 600, JSON.stringify(response.data))

    return res.status(200).json({
      message: "Fetch dogs API",
      data: response.data,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
    })
  }
})

app.listen(PORT, async () => {
  db.sequelize.sync({ alter: true })

  if (!fs.existsSync("public")) {
    fs.mkdirSync("public")
  }

  // await redisClient.connect()

  console.log("Listening in port", PORT)
})

