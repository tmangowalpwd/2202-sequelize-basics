const { Op } = require("sequelize")
const db = require("../models")

module.exports = {
  createExpense: async (req, res) => {
    try {
      const { amount, categoryId, userId } = req.body

      const today = new Date()

      await db.Expense.create({
        amount,
        CategoryId: categoryId,
        UserId: userId,
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      })

      return res.status(201).json({
        message: "Created expense",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  getTotalExpenses: async (req, res) => {
    try {
      const { group, fromDate, toDate } = req.query

      if (group === "category") {
        const getTotalExpensesByCategory = await db.Expense.findAll({
          attributes: [
            [db.sequelize.fn("sum", db.sequelize.col("amount")), "sum_amount"],
            "Category.category_name",
          ],
          include: [{ model: db.Category }],
          group: "categoryId",
        })

        // const [getTotalExpensesByCategory] = await db.sequelize.query(
        //   `SELECT SUM(amount) AS sum_amount, c.category_name FROM Expenses e
        //   JOIN Categories c on c.id = e.CategoryId
        //   GROUP BY e.CategoryId`
        // )

        return res.status(200).json({
          message: "Get total expenses by category",
          data: getTotalExpensesByCategory,
        })
      }

      if (group === "day" || group === "month" || group === "year") {
        const getTotalExpensesByTimePeriod = await db.Expense.findAll({
          attributes: [
            [db.sequelize.fn("sum", db.sequelize.col("amount")), "sum_amount"],
            group,
          ],
          group,
        })

        return res.status(200).json({
          message: "Get total expenses by " + group,
          data: getTotalExpensesByTimePeriod,
        })
      }

      if (!group && fromDate && toDate) {
        const getTotalExpensesByDateRange = await db.Expense.findAll({
          where: {
            createdAt: {
              [Op.between]: [fromDate, toDate],
            },
          },
          attributes: [
            [db.sequelize.fn("sum", db.sequelize.col("amount")), "sum_amount"],
          ],
        })

        return res.status(200).json({
          message: "Get total expenses by date range",
          data: getTotalExpensesByDateRange,
        })
      }

      return res.status(400).json({
        message: "Missing group, fromDate, or toDate parameters",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  loginUser: async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body

      const findUserByUsernameOrEmail = await db.User.findOne({
        where: {
          [Op.or]: {
            username: usernameOrEmail,
            email: usernameOrEmail,
          },
        },
      })

      if (!findUserByUsernameOrEmail) {
        return res.status(400).json({
          message: "Username or email not found"
        })
      }

      if (findUserByUsernameOrEmail.is_suspended) {
        return res.status(400).json({
          message: "Failed to login, your account is suspended"
        })
      }

      if (findUserByUsernameOrEmail.password !== password) {
        // findUserByUsernameOrEmail.login_attempts += 1
        // findUserByUsernameOrEmail.save()

        if (findUserByUsernameOrEmail.login_attempts > 2) {
          findUserByUsernameOrEmail.is_suspended = true
          findUserByUsernameOrEmail.save()

          return res.status(400).json({
            message: "Wrong password, your account has been suspended"
          })
        }

        await db.User.increment(
          "login_attempts",
          {
            where: {
              [Op.or]: {
                username: usernameOrEmail,
                email: usernameOrEmail,
              },
            },
          }
        )

        return res.status(400).json({
          message: "Wrong password",
        })
      }

      delete findUserByUsernameOrEmail.dataValues.password

      findUserByUsernameOrEmail.login_attempts = 0
      findUserByUsernameOrEmail.save()

      return res.status(200).json({
        message: "Login successful",
        data: findUserByUsernameOrEmail
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

