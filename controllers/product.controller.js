const { User, Product, Category } = require("../models");
const numeral = require("numeral");
function string2money(value) {
  return numeral(`${value}`).format("0,0");
}
exports.getProduct = async (req, res) => {
  await Product.findAll()
    .then((product) => {
      let products = [];
      for (i = 0; i < product.length; i++) {
        products.push({
          id: product[i].dataValues.id,
          title: product[i].dataValues.title,
          price: `Rp ${string2money(product[i].dataValues.price)}`,
          stock: product[i].dataValues.stock,
          CategoryId: product[i].dataValues.CategoryId,
          createdAt: product[i].dataValues.createdAt,
          updatedAt: product[i].dataValues.updatedAt,
        });
      }
      res.status(200).json({ products: products });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Memuat Product",
      });
    });
};
exports.postProduct = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user?.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Product",
    });
  }
  const { title, price, stock, CategoryId } = req.body;
  const category = await Category.findByPk(CategoryId);
  if (category) {
    await Product.create({
      title,
      stock,
      price,
      CategoryId,
    })
      .then((product) => {
        res.status(201).json({
          product: {
            id: product.id,
            title: product.title,
            price: `Rp ${string2money(product.price)}`,
            stock: product.stock,
            CategoryId: product.CategoryId,
            updatedAt: product.updatedAt,
            createdAt: product.createdAt,
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

exports.putProduct = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const productId = req.params.productId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user?.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Mengubah Product",
    });
  }
  const { title, price, stock } = req.body;
  let data = { title, price, stock };
  const product = await Product.findByPk(productId);
  if (product) {
    await Product.update(data, {
      where: {
        id: productId,
      },
      returning: true,
      plain: true,
    })
      .then((product) => {
        res.status(200).json({
          product: {
            id: product[1].dataValues.id,
            title: product[1].dataValues.title,
            price: product[1].dataValues.price,
            stock: product[1].dataValues.stock,
            updatedAt: product[1].dataValues.updatedAt,
            createdAt: product[1].dataValues.createdAt,
            CategoryId: product[1].dataValues.CategoryId,
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
      message: "Product Id Tidak Valid",
    });
  }
};

exports.patchProduct = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const productId = req.params.productId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user?.role === "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Mengubah Product",
    });
  }
  const { CategoryId } = req.body;
  const category = await Category.findByPk(CategoryId);
  const product = await Product.findByPk(productId);
  if (product) {
    return res.status(503).json({
      message: "Product Id Tidak Valid",
    });
  }
  let data = { CategoryId };
  if (category) {
    await Product.update(data, {
      where: {
        id: productId,
      },
      returning: true,
      plain: true,
    })
      .then((product) => {
        res.status(200).json({
          product: {
            id: product[1].dataValues.id,
            title: product[1].dataValues.title,
            price: product[1].dataValues.price,
            stock: product[1].dataValues.stock,
            updatedAt: product[1].dataValues.updatedAt,
            createdAt: product[1].dataValues.createdAt,
            CategoryId: product[1].dataValues.CategoryId,
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

exports.deleteProduct = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const productId = req.params.productId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user?.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menghapus Product",
    });
  }
  const product = await Product.findByPk(productId);
  if (product) {
    await Product.destroy({
      where: {
        id: productId,
      },
    })
      .then((result) => {
        res.status(200).json({
          message: "Product has been successfully deleted",
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Gagal Menghapus Product",
        });
      });
  } else {
    res.status(503).json({
      message: "Product Id Tidak Valid",
    });
  }
};
