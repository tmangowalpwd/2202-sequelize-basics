const express = require("express")
const dotenv = require("dotenv")
const db = require("./models")
const cors = require("cors")

dotenv.config()

const PORT = 2000

const app = express()
app.use(cors())
app.use(express.json())

const expensesRoute = require("./routes/expensesRoute")
const authRoute = require("./routes/authRoute")
const postsRoute = require("./routes/postsRoute")

const { verifyToken } = require("./middlewares/authMiddleware")

app.use("/expenses", verifyToken, expensesRoute)
app.use("/auth", authRoute)
app.use("/posts", postsRoute)

app.listen(PORT, () => {
  db.sequelize.sync({ alter: true })
  console.log("Listening in port", PORT)
})

