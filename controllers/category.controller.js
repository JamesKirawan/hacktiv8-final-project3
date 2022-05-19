const { User, Category } = require("../models");
exports.getCategory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Melihat Category",
    });
  }
  await Category.findAll()
    .then((category) => {
      res.status(200).json({ categories: category });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Memuat Category",
      });
    });
};
exports.postCategory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Category",
    });
  }
  const { type } = req.body;
  await Category.create({
    type,
  })
    .then((category) => {
      res.status(201).json({
        category: {
          id: category.id,
          type: category.type,
          updatedAt: category.updatedAt,
          createdAt: category.createdAt,
          sold_product_amount: category.sold_product_amount,
        },
      });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Menambah Category",
      });
    });
};
exports.patchCategory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const categoryId = req.params.categoryId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Category",
    });
  }
  const { type } = req.body;
  let data = { type };
  await Category.update(data, {
    where: {
      id: categoryId,
    },
    returning: true,
    plain: true,
  })
    .then((category) => {
      res.status(200).json({
        category: {
          id: category[1].dataValues.id,
          type: category[1].dataValues.type,
          updatedAt: category[1].dataValues.updatedAt,
          createdAt: category[1].dataValues.createdAt,
          sold_product_amount: category[1].dataValues.sold_product_amount,
        },
      });
    })
    .catch((e) => {
      res.status(500).json({
        message: "Gagal Mengubah Category",
      });
    });
};
exports.deleteCategory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const categoryId = req.params.categoryId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Category",
    });
  }
  await Category.destroy({
    where: {
      id: categoryId,
    },
  })
    .then((result) => {
      res.status(200).json({
        message: "Category has been successfully deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Gagal Menghapus Category",
      });
    });
};
