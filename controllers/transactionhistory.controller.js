const { User, TransactionHistory, Product } = require("../models");
exports.postTransactionHistory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Transaction History",
    });
  }
  const { ProductId, quantity, UserId, total_price} = req.body;
  await TransactionHistory.create({
    ProductId,
    quantity,
    UserId,
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

exports.getTransactionHistoryUser = async (req, res) => {
  await TransactionHistory.findAll({
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "title", "price", "stock", "CategoryId"],
      },
    ]
  })
    .then((transactionhistory) => {
      res.status(200).json({ TransactionHistories: transactionhistory });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Memuat Transaction History",
      });
    });
};

exports.getTransactionHistoryAdmin = async (req, res) => {
  await TransactionHistory.findAll({
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "title", "price", "stock", "CategoryId"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "email", "balance", "gender", "role"],
      },
    ]
  })
    .then((transactionhistory) => {
      res.status(200).json({ TransactionHistories: transactionhistory });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Memuat Transaction History",
      });
    });
};

exports.getTransactionHistoryId = async (req, res) => {  
  const transactionhistoryId = req.params.transactionhistoryId;
  await TransactionHistory.findOne({ 
    where : {id:transactionhistoryId},
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "title", "price", "stock", "CategoryId"],
      },
    ]
  })
    .then((transactionhistory) => {
      res.status(200).json({ TransactionHistories: transactionhistory });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Memuat Transaction History",
      });
    });
};

