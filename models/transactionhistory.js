'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: "ProductId",
        as: "product",
      });
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "user",
      });
    }
  }
  TransactionHistory.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity:  {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price:  {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};