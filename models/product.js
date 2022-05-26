"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: "CategoryId",
        as: "category",
      });
    }
  }
  Product.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          customValidator(value) {
            if (value > 50000000) {
              throw new Error("Price Tidak Boleh Melebihi Angka 50000000");
            }
            if (value < 0) {
              throw new Error("Price Tidak Boleh Kurang Dari Angka 0");
            }
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          customValidator(value) {
            if (value < 5) {
              throw new Error("Stock Tidak Boleh Kurang Dari Angka 5");
            }
          },
        },
      },
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
