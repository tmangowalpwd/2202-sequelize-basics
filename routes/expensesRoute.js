const express = require('express')
const expensesController = require('../controllers/expensesController')

const router = express.Router()

// 1. Ketika create expense, tidak terima UserId di body
//    otomatis dapetin ID user yang sedang login
//    lalu masukin ke UserId di setiap expense yang dibuat
router.post("/", expensesController.createExpense)


router.get("/total", expensesController.getTotalExpenses)
router.post("/login", expensesController.loginUser)

// 2. Dapetin list expenses dari user yang sedang login
//    Jangan pake body, query, dan route params
router.get("/me", expensesController.getMyExpenses)

module.exports = router