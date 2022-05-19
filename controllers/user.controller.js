const { User } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../middlewares/auth");
const numeral = require("numeral");
function string2money(value) {
  return numeral(`${value}`).format("0,0");
}
exports.registerUser = async (req, res) => {
  const body = req.body;
  const fullName = body.full_name;
  const email = body.email;
  const password = body.password;
  const gender = body.gender;
  const role = "customer";
  await User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (user) {
        return res.status(400).send({
          message: "Email already exists",
        });
      } else {
        User.create({
          full_name: fullName,
          email: email,
          password: password,
          gender: gender,
          role: role,
        })
          .then((user) => {
            const token = generateToken({
              id: user.id,
              full_name: user.full_name,
              email: user.email,
              gender: user.gender,
              role: user.role,
            });
            res.status(201).json({
              user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                gender: user.gender,
                balance: `Rp ${string2money(user.balance)}`,
                createdAt: user.createdAt,
              },
            });
          })
          .catch((e) => {
            let message = [];
            e.errors.forEach((item) => {
              message.push({
                [item.path]: item.message,
              });
            });
            res.status(503).json({ errors: e.message });
          });
      }
    })
    .catch((e) => {
      res.status(500).send({
        status: "FAIL",
        message: "Gagal membuat user",
      });
    });
};

exports.loginUser = async (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  await User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          name: "User Login Error",
          message: `User's with email "${email}" not found`,
        });
      }

      const isCorrect = comparePassword(password, user.password);

      if (!isCorrect) {
        return res.status(400).json({
          name: "User Login Error",
          message: `User's password with email "${email}" doesn't match`,
        });
      }
      let payload = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        gender: user.gender,
        role: user.role,
      };
      const token = generateToken(payload);
      return res.status(200).json({ token });
    })
    .catch((err) => {
      return res.status(401).json(err);
    });
};

exports.putUser = async (req, res) => {
  const userIdFromHeader = req.userId;
  const userIdFromParams = req.params.userId;
  if (userIdFromHeader != userIdFromParams) {
    return res.status(400).json({
      message: "Tidak Memiliki Hak Untuk Mengubah User Tersebut",
    });
  }
  const { full_name, email } = req.body;
  let data = {
    email,
    full_name,
  };
  await User.update(data, {
    where: {
      id: userIdFromHeader,
    },
    returning: true,
    plain: true,
  })
    .then((user) => {
      res.status(200).json({
        user: {
          id: user[1].dataValues.id,
          full_name: user[1].dataValues.full_name,
          email: user[1].dataValues.email,
          createdAt: user[1].dataValues.createdAt,
          updatedAt: user[1].dataValues.updatedAt,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Gagal Mengubah Data",
      });
    });
};

exports.deleteUser = async (req, res) => {
  const userIdFromHeader = req.userId;
  const userIdFromParams = req.params.userId;
  if (userIdFromParams != userIdFromHeader) {
    return res.status(400).json({
      message: "Tidak Memiliki Hak Untuk Menghapus User Tersebut",
    });
  }
  await User.destroy({
    where: {
      id: userIdFromParams,
    },
  })
    .then((result) => {
      res.status(200).json({
        message: "Your Account Has Been successfully deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Gagal Menghapus User",
      });
    });
};

exports.patchUser = async (req, res) => {
  const userIdFromHeader = req.userId;
  const user = await User.findByPk(userIdFromHeader);
  const { balance } = req.body;
  const newBalance = parseFloat(balance) + parseFloat(user.balance);
  let data = {
    balance: newBalance,
  };
  await User.update(data, {
    where: {
      id: userIdFromHeader,
    },
    returning: true,
    plain: true,
  })
    .then((user) => {
      res.status(200).json({
        message: `Your balance has been successfully updated to Rp ${string2money(
          user[1].dataValues.balance
        )}`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
};
