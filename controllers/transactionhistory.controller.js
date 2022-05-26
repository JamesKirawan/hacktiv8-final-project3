const { User, Product, Category, TransactionHistory } = require("../models");
const numeral = require("numeral");
function string2money(value) {
  return numeral(`${value}`).format("0,0");
}
exports.postTransactionHistory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  const { productId, quantity } = req.body;
  const product = await Product.findByPk(productId);
  if (product) {
    const stock = product.dataValues.stock;
    if (stock >= quantity) {
      const balance = user.dataValues.balance;
      const needBalance = quantity * product.dataValues.price;
      if (balance >= needBalance) {
        const curStock = stock - quantity;
        let dataProduct = { stock: curStock };
        const categoryId = product.dataValues.CategoryId;
        const category = await Category.findByPk(categoryId);
        const curSoldAmount =
          category.dataValues.sold_product_amount + quantity;
        let dataCategory = { sold_product_amount: curSoldAmount };
        const curBalance = balance - needBalance;
        let dataUser = { balance: curBalance };
        try {
          await Category.update(dataCategory, {
            where: {
              id: categoryId,
            },
          });
          await Product.update(dataProduct, {
            where: {
              id: productId,
            },
          });
          await User.update(dataUser, {
            where: {
              id: userIdFromHeaders,
            },
          });
          let dataTransactionHistory = {
            ProductId: product.dataValues.id,
            UserId: user.dataValues.id,
            quantity: quantity,
            total_price: needBalance,
          };
          await TransactionHistory.create(dataTransactionHistory);
          res.status(201).json({
            message: "You have successfully purchase the product",
            transactionBill: {
              total_price: `Rp ${string2money(needBalance)}`,
              quantity: quantity,
              product_name: product.dataValues.title,
            },
          });
        } catch (e) {
          res.status(503).json({
            message: "Gagal Melakukan Pembelian",
          });
        }
      } else {
        res.status(400).json({
          message: "Saldo Anda Tidak Cukup Untuk Membeli Ini",
        });
      }
    } else {
      res.status(400).json({
        message: "Stock Tidak Cukup",
      });
    }
  } else {
    res.status(503).json({
      message: "Product Tidak Ada",
    });
  }
};

exports.getTransactionHistoryUser = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  await TransactionHistory.findAll({
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
    where: {
      UserId: user.dataValues.id,
    },
  }).then((transactionHistory) => {
    let transactionHistories = [];
    for (i = 0; i < transactionHistory.length; i++) {
      transactionHistories.push({
        ProductId: transactionHistory[i].dataValues.ProductId,
        UserId: transactionHistory[i].dataValues.UserId,
        quantity: transactionHistory[i].dataValues.quantity,
        total_price: transactionHistory[i].dataValues.total_price,
        createdAt: transactionHistory[i].dataValues.createdAt,
        updatedAt: transactionHistory[i].dataValues.updatedAt,
        Product: {
          id: transactionHistory[i].dataValues.product.id,
          title: transactionHistory[i].dataValues.product.title,
          price: `Rp ${string2money(
            transactionHistory[i].dataValues.product.price
          )}`,
          stock: transactionHistory[i].dataValues.product.stock,
          CategoryId: transactionHistory[i].dataValues.product.CategoryId,
        },
      });
    }
    res.status(200).json({
      transactionHistories,
    });
  });
};

exports.getTransactionHistoryAdmin = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role === "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Dapat Melihat History Transaksi Admin",
    });
  }
  await TransactionHistory.findAll({
    include: [
      {
        model: Product,
        as: "product",
      },
      {
        model: User,
        as: "user",
      },
    ],
  }).then((transactionHistory) => {
    let transactionHistories = [];
    for (i = 0; i < transactionHistory.length; i++) {
      transactionHistories.push({
        ProductId: transactionHistory[i].dataValues.ProductId,
        UserId: transactionHistory[i].dataValues.UserId,
        quantity: transactionHistory[i].dataValues.quantity,
        total_price: transactionHistory[i].dataValues.total_price,
        createdAt: transactionHistory[i].dataValues.createdAt,
        updatedAt: transactionHistory[i].dataValues.updatedAt,
        Product: {
          id: transactionHistory[i].dataValues.product.id,
          title: transactionHistory[i].dataValues.product.title,
          price: `Rp ${string2money(
            transactionHistory[i].dataValues.product.price
          )}`,
          stock: transactionHistory[i].dataValues.product.stock,
          CategoryId: transactionHistory[i].dataValues.product.CategoryId,
        },
        User: {
          id: transactionHistory[i].dataValues.user.id,
          email: transactionHistory[i].dataValues.user.email,
          balance: `Rp ${string2money(
            transactionHistory[i].dataValues.user.balance
          )}`,
          gender: transactionHistory[i].dataValues.user.gender,
          role: transactionHistory[i].dataValues.user.role,
        },
      });
    }
    res.status(200).json({
      transactionHistories,
    });
  });
};

exports.getTransactionHistory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const transactionId = req.params.transactionId;
  const user = await User.findByPk(userIdFromHeaders);
  const transaction = await TransactionHistory.findByPk(transactionId);
  if (user.role == "customer" && transaction.UserId != user.id) {
    return res.status(401).json({
      message: "Anda Tidak Memiliki Hak Untuk Melihat Transaksi Ini",
    });
  }
  if (transaction) {
    await TransactionHistory.findOne({
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
      where: {
        id: transactionId,
      },
    })
      .then((transactionHistory) => {
        res.status(200).json({
          ProductId: transactionHistory.dataValues.ProductId,
          UserId: transactionHistory.dataValues.UserId,
          quantity: transactionHistory.dataValues.quantity,
          total_price: transactionHistory.dataValues.total_price,
          createdAt: transactionHistory.dataValues.createdAt,
          updatedAt: transactionHistory.dataValues.updatedAt,
          Product: {
            id: transactionHistory.dataValues.product.id,
            title: transactionHistory.dataValues.product.title,
            price: `Rp ${string2money(
              transactionHistory.dataValues.product.price
            )}`,
            stock: transactionHistory.dataValues.product.stock,
            CategoryId: transactionHistory.dataValues.product.CategoryId,
          },
        });
      })
      .catch((e) => {
        res.status(503).json({
          message: "Gagal Memuat Transaction History",
        });
      });
  } else {
    res.status(500).json({
      message: "Transaction History Tidak Ditemukan",
    });
  }
};
