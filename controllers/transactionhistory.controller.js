const { User, TransactionHistory } = require("../models");
exports.getTransactionHistory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Melihat Transaction History",
    });
  }
  await TransactionHistory.findAll()
    .then((transactionhistory) => {
      res.status(200).json({ TransactionHistories: transactionhistory });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Memuat Transaction History",
      });
    });
};
exports.postTransactionHistory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Transaction History",
    });
  }
  const { ProductId, UserId, quantity, total_price } = req.body;
  await TransactionHistory.create({
    ProductId,
    UserId, 
    quantity, 
    total_price,
  })
    .then((transactionhistory) => {
      res.status(201).json({
        transactionhistory: {
          id: transactionhistory.id,
          ProductId: transactionhistory.ProductId,
          UserId: transactionhistory.UserId,
          quantity: transactionhistory.quantity,
          total_price: transactionhistory.total_price,
          updatedAt: transactionhistory.updatedAt,
          createdAt: transactionhistory.createdAt,
          },
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(503).json({
        message: "Gagal Menambah Transaction History",
      });
    });
};
exports.patchTransactionHistory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const transactionhistoryId = req.params.transactionhistoryId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Transaction History",
    });
  }
  const { ProductId, UserId, quantity, total_price  } = req.body;
  let data = { ProductId, UserId, quantity, total_price  };
  await TransactionHistory.update(data, {
    where: {
      id: transactionhistoryId,
    },
    returning: true,
    plain: true,
  })
    .then((transactionhistory) => {
      res.status(200).json({
        transactionhistory: {
          id: transactionhistory[1].dataValues.id,
          ProductId: transactionhistory[1].dataValues.ProductId,          
          UserId: transactionhistory[1].dataValues.UserId,
          quantity: transactionhistory[1].dataValues.quantity,          
          total_price: transactionhistory[1].dataValues.total_price,
          updatedAt: transactionhistory[1].dataValues.updatedAt,
          createdAt: transactionhistory[1].dataValues.createdAt,
        },
      });
    })
    .catch((e) => {
      res.status(500).json({
        message: "Gagal Mengubah Transaction History",
      });
    });
};
exports.deleteTransactionHistory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const transactionhistoryId = req.params.transactionhistoryId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Transaction History",
    });
  }
  await TransactionHistory.destroy({
    where: {
      id: transactionhistoryId,
    },
  })
    .then((result) => {
      res.status(200).json({
        message: "Transaction History has been successfully deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Gagal Menghapus Transaction History",
      });
    });
};
