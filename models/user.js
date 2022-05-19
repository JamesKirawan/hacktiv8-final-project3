"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: {
            args: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            msg: "Email Tidak Valid",
          },
        },
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.INTEGER,
        unique: true,
        validate: {
          customValidator(value) {
            if (value < 0) {
              throw new Error("Balance harus besar dari 0");
            } else if (value > 100000000) {
              throw new Error("Balance harus tidak lebih dari 100000000");
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          customValidator(value) {
            console.log(value);
            if (value.length < 6) {
              throw new Error("Password Harus Memiliki Minimal Panjang 6");
            } else if (value.length > 10) {
              throw new Error(
                "Password Tidak Boleh Memiliki Panjang Lebih Dari 10"
              );
            }
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          customValidator(value) {
            if (value !== "male" && value !== "female") {
              throw new Error(
                "Gender Hanya Dapat Diisi Dengan `male` dan `female`"
              );
            }
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          customValidator(value) {
            if (value !== "admin" && value !== "customer") {
              throw new Error(
                "Role Hanya Dapat Diisi dengan `admin` atau `customer`"
              );
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (user, opt) => {
          const hashedPassword = hashPassword(user.password);
          user.password = hashedPassword;
          user.balance = 0;
        },
      },
    }
  );
  return User;
};
