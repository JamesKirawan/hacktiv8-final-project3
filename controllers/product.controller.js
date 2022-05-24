const { User, Product } = require("../models");
exports.getProduct = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Melihat Product",
    });
  }
  await Product.findAll()
    .then((product) => {
      res.status(200).json({ products: product });
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
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Product",
    });
  }
  const { title, price, stock, CategoryId } = req.body;
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
          price: product.price,
          stock: product.stock,
          CategoryId: product.CategoryId,
          updatedAt: product.updatedAt,
          createdAt: product.createdAt,
          },
      });
    })
    .catch((e) => {
      res.status(503).json({
        message: "Gagal Menambah Product",
      });
    });
};
exports.patchProduct = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const productId = req.params.productId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Product",
    });
  }
  const { title, price, stock } = req.body;
  let data = { title, price, stock};
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
        message: "Gagal Mengubah Product",
      });
    });
};
exports.deleteProduct = async (req, res) => {
  const userIdFromHeaders = req.userId;
  const productId = req.params.productId;
  const user = await User.findByPk(userIdFromHeaders);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "Hanya Admin Yang Diperbolehkan Menambah Product",
    });
  }
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
};
