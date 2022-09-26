const express = require("express")
const dotenv = require("dotenv")
const db = require("./models")

dotenv.config()

const PORT = 2000

const app = express()

app.use(express.json())

const expensesRoute = require("./routes/expensesRoute")
const authRoute = require("./routes/authRoute")

const { verifyToken } = require("./middlewares/authMiddleware")

app.use("/expenses", verifyToken, expensesRoute)
app.use("/auth", authRoute)

app.listen(PORT, () => {
  db.sequelize.sync({ alter: true })
  console.log("Listening in port", PORT)
})

