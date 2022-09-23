const express = require('express')
const expensesController = require('../controllers/expensesController')

const router = express.Router()

router.post("/", expensesController.createExpense)
router.get("/total", expensesController.getTotalExpenses)
router.post("/login", expensesController.loginUser)

module.exports = router