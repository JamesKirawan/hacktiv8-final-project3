"use strict";
const { hashPassword } = require("../helpers/bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert("Users", [
      {
        full_name: "admin",
        email: "admin@aibohphobia.com",
        password: hashPassword("secret"),
        gender: "male",
        role: "admin",
        balance: 200000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", [
      {
        full_name: "admin",
      },
    ]);
  },
};
