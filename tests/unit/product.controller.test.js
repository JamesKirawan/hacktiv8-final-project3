const ProductController = require("../../controllers/product.controller");
const httpMocks = require("node-mocks-http");
const { Product, User, Category } = require("../../models");

jest.mock("../../models/");

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});
beforeEach(() => {
  jest.clearAllMocks();
});

const productData = {
  id: 1,
  title: "Royal Cannin",
  price: "20000",
  stock: 2,
  CategoryId: 1,
  createdAt: "2022-01-01",
  updatedAt: "2022-01-01",
};
const productData1 = [
  {},
  {
    dataValues: [
      {
        id: 1,
        title: "Royal Cannin",
        price: "20000",
        stock: 2,
        CategoryId: 1,
        createdAt: "2022-01-01",
        updatedAt: "2022-01-01",
      },
    ],
  },
];

const adminData = {
  role: "admin",
};
const userData = {
  role: "customer",
};
const categoryData = {
  id: 1,
  type: "Makanan Kering",
};
const emptyCategoryData = null;

describe("ProductController.getProduct", () => {
  it("should return 200", async () => {
    Product.findAll.mockResolvedValue(productData);
    await ProductController.getProduct(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 503", async () => {
    const rejected = Promise.reject({ message: "Error" });
    Product.findAll.mockResolvedValue(rejected);
    await ProductController.getProduct(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("ProductController.postProduct", () => {
  it("should return 201", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.findByPk.mockResolvedValue(categoryData);
    Product.create.mockResolvedValue(productData);
    await ProductController.postProduct(req, res);
    expect(res.statusCode).toBe(201);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await ProductController.postProduct(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 500", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.findByPk.mockResolvedValue(categoryData);
    const rejected = Promise.reject({ message: "Error" });
    Product.create.mockResolvedValue(rejected);
    await ProductController.postProduct(req, res);
    expect(res.statusCode).toBe(500);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.findByPk.mockResolvedValue(null);
    await ProductController.postProduct(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("ProductController.putProduct", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(productData);
    Product.update.mockResolvedValue(productData1);
    await ProductController.putProduct(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await ProductController.putProduct(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 500", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(productData);
    Product.update.mockResolvedValue(Promise.reject({ message: "Error" }));
    await ProductController.putProduct(req, res);
    expect(res.statusCode).toBe(500);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(null);
    await ProductController.putProduct(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("ProductController.patchProduct", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(productData);
    Product.update.mockResolvedValue(productData1);
    await ProductController.patchProduct(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await ProductController.patchProduct(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 500", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(productData);
    Product.update.mockResolvedValue(Promise.reject({ message: "Error" }));
    await ProductController.patchProduct(req, res);
    expect(res.statusCode).toBe(500);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.findByPk.mockResolvedValue(null);
    await ProductController.patchProduct(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("ProductController.deleteProduct", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(productData);
    Product.destroy.mockResolvedValue(productData1);
    await ProductController.deleteProduct(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await ProductController.deleteProduct(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 500", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(productData);
    Product.destroy.mockResolvedValue(Promise.reject({ message: "Error" }));
    await ProductController.deleteProduct(req, res);
    expect(res.statusCode).toBe(500);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Product.findByPk.mockResolvedValue(null);
    await ProductController.deleteProduct(req, res);
    expect(res.statusCode).toBe(503);
  });
});
