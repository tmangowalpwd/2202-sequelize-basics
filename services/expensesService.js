const db = require("../models")

const Expense = db.Expense

class ExpensesService {
  async createExpense({ amount, categoryId, userId }) {
    try {
      const today = new Date()

      const result = await Expense.create({
        amount,
        CategoryId: categoryId,
        UserId: userId,
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      })

      return {
        success: true,
        result
      }
    } catch (err) {
      return {
        success: false,
        err
      }
    }
  }
}

module.exports = ExpensesService


// class UserService {
//   async createUser() {
//     // Check username used or not
//     // Check email used or not
//     // Hash password
//     // ...
//   }

//   async registerUser() {
//     this.createUser()
//     // create html template
//     // create verif link
//     // send email
//   }
// }