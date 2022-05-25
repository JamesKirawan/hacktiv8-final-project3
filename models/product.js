'use strict';
const {
  Model
} = require('sequelize');
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
  Product.init({
    title:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        customValidator(value) {
          if (value < 0) {
            throw new Error("Price harus besar dari 0");
          } else if (value > 50000000) {
            throw new Error("Price harus tidak lebih dari 50000000");
          }
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        customValidator(value) {
          console.log(value);
          if (value.length < 5) {
            throw new Error("Stock Harus Memiliki Minimal Panjang 5");
          } 
        },
      },
    },
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};