const { User, Category, Product } = require("../models");
const numeral = require("numeral");
function string2money(value) {
  return numeral(`${value}`).format("0,0");
}
exports.getCategory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Melihat Category",
    });
  }
  await Category.findAll({
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
  })
    .then((category) => {
      let categories = [];
      for (i = 0; i < category.length; i++) {
        let products = [];
        if (category[i].dataValues.product.length > 0) {
          for (j = 0; j < category[i].dataValues.product.length; j++) {
            products.push({
              id: category[i].dataValues.product[j].id,
              title: category[i].dataValues.product[j].title,
              price: `Rp ${string2money(
                category[i].dataValues.product[j].price
              )}`,
              stock: category[i].dataValues.product[j].stock,
              categoryId: category[i].dataValues.product[j].categoryId,
              createdAt: category[i].dataValues.product[j].createdAt,
              updatedAt: category[i].dataValues.product[j].updatedAt,
            });
          }
        }
        categories.push({
          id: category[i].dataValues.id,
          type: category[i].dataValues.type,
          sold_product_amount: category[i].dataValues.sold_product_amount,
          createdAt: category[i].dataValues.createdAt,
          updatedAt: category[i].dataValues.updatedAt,
          Products: products,
        });
      }
      res.status(200).json({ categories });
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
        message: e.message,
      });
    });
};
exports.patchCategory = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const categoryId = req.params.categoryId;
  const user = await User.findByPk(userIdFromHeaders);
  const category = await Category.findByPk(categoryId);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Category",
    });
  }
  const { type } = req.body;
  let data = { type };
  if (category) {
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
          message: e.message,
        });
      });
  } else {
    res.status(503).json({
      message: "Category Id Tidak Valid",
    });
  }
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
  const category = await Category.findByPk(categoryId);
  if (category) {
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
  } else {
    res.status(503).json({
      message: "Category Id Tidak Valid",
    });
  }
};
