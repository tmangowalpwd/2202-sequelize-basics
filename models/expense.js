"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expense.belongsTo(models.User)
      Expense.belongsTo(models.Category)
    }
  }
  Expense.init(
    {
      amount: DataTypes.INTEGER,
      day: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Expense",
    }
  )
  return Expense
}
