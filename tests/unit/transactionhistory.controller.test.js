const TransactionHistoryController = require("../../controllers/transactionhistory.controller.js");
const httpMocks = require("node-mocks-http");
const { TransactionHistory, User, Category, Product } = require("../../models");
jest.mock("../../models");
// const Category = require("../../models/category");
// const User = require("../../models/user");
// const TransactionHistory = require("../../models/transactionhistory");
// const Product = require("../../models/product");

// jest.mock("../../models/user");
// jest.mock("../../models/category");
// jest.mock("../../models/transactionhistory");
// jest.mock("../../models/product");

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});
beforeEach(() => {
  jest.clearAllMocks();
});

const adminData = {
  role: "admin",
};
const userData = {
  role: "customer",
  id: 1,
};

const transactionHistoryData = {
  total_price: "100",
  quantity: 2,
  product_name: "Hellow",
};

const realTransactionHistoryData = {
  dataValues: {
    id: 1,
    total_price: "100",
    quantity: 2,
    product_name: "Hellow",
    product: {
      id: 1,
      title: "Royal Canin",
      price: "2000",
      stock: 2,
      CategoryId: 1,
    },
  },
};

const transactionHistoryData2 = {
  id: 1,
  total_price: "100",
  quantity: 2,
  product_name: "Hellow",
  UserId: 2,
};

const categoryData = {
  dataValues: {
    id: 1,
    type: "Makanan Kering",
    createdAt: "2022-01-01",
    updatedAt: "2022-02-02",
    sold_product_amount: 0,
  },
};

const productData = {
  dataValues: {
    id: 1,
    title: "Royal Cannin",
    price: "100",
    stock: 200,
    CategoryId: 1,
    createdAt: "2022-01-01",
    updatedAt: "2022-01-01",
  },
};

const userRealData = {
  dataValues: {
    id: 1,
    balance: 200000,
  },
};

describe("TransactionHistoryController.postTransactionHistory", () => {
  it("should return 201", async () => {
    User.findByPk
      .mockResolvedValueOnce(userRealData)
      .mockResolvedValueOnce(productData)
      .mockResolvedValue(categoryData);
    Category.update
      .mockResolvedValueOnce(categoryData)
      .mockResolvedValueOnce(productData)
      .mockResolvedValueOnce(userRealData);
    TransactionHistory.create.mockResolvedValue(transactionHistoryData);
    req.body.quantity = 1;
    await TransactionHistoryController.postTransactionHistory(req, res);
    expect(res.statusCode).toBe(201);
  });
  it("should return 400", async () => {
    User.findByPk
      .mockResolvedValueOnce(userRealData)
      .mockResolvedValueOnce(productData)
      .mockResolvedValue(categoryData);
    Category.update
      .mockResolvedValueOnce(categoryData)
      .mockResolvedValueOnce(productData)
      .mockResolvedValueOnce(userRealData);
    TransactionHistory.create.mockResolvedValue(transactionHistoryData);
    req.body.quantity = 200000;
    await TransactionHistoryController.postTransactionHistory(req, res);
    expect(res.statusCode).toBe(400);
  });
  it("should return 500", async () => {
    User.findByPk
      .mockResolvedValueOnce(userRealData)
      .mockResolvedValueOnce(null)
      .mockResolvedValue(categoryData);
    Category.update
      .mockResolvedValueOnce(categoryData)
      .mockResolvedValueOnce(productData)
      .mockResolvedValueOnce(userRealData);
    TransactionHistory.create.mockResolvedValue(transactionHistoryData);
    req.body.quantity = 200000;
    await TransactionHistoryController.postTransactionHistory(req, res);
    expect(res.statusCode).toBe(500);
  });
  it("should return 503", async () => {
    User.findByPk
      .mockResolvedValueOnce(userRealData)
      .mockResolvedValueOnce(productData)
      .mockResolvedValue(categoryData);
    Category.update
      .mockResolvedValueOnce(categoryData)
      .mockResolvedValueOnce(productData)
      .mockResolvedValueOnce(userRealData);
    TransactionHistory.create.mockRejectedValue(new Error());
    req.body.quantity = 1;
    await TransactionHistoryController.postTransactionHistory(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("TransactionHistoryController.getTransactionHistoryUser", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(userRealData);
    TransactionHistory.findAll.mockResolvedValue(transactionHistoryData);
    await TransactionHistoryController.getTransactionHistoryUser(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(userRealData);
    TransactionHistory.findAll.mockResolvedValue(
      Promise.reject({ message: "Error" })
    );
    await TransactionHistoryController.getTransactionHistoryUser(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("TransactionHistoryController.getTransactionHistoryAdmin", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(adminData);
    TransactionHistory.findAll.mockResolvedValue(transactionHistoryData);
    await TransactionHistoryController.getTransactionHistoryAdmin(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    TransactionHistory.findAll.mockResolvedValue(transactionHistoryData);
    await TransactionHistoryController.getTransactionHistoryAdmin(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(adminData);
    TransactionHistory.findAll.mockResolvedValue(
      Promise.reject({ message: "Error" })
    );
    await TransactionHistoryController.getTransactionHistoryAdmin(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("TransactionHistoryController.getTransactionHistory", () => {
  it("should return 200", async () => {
    User.findByPk
      .mockResolvedValueOnce(adminData)
      .mockResolvedValue(transactionHistoryData2);
    TransactionHistory.findOne.mockResolvedValue(realTransactionHistoryData);
    req.params.transactionId = 1;
    await TransactionHistoryController.getTransactionHistory(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk
      .mockResolvedValueOnce(userData)
      .mockResolvedValue(transactionHistoryData2);
    TransactionHistory.findOne.mockResolvedValue(realTransactionHistoryData);
    req.params.transactionId = 1;
    await TransactionHistoryController.getTransactionHistory(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 500", async () => {
    User.findByPk.mockResolvedValueOnce(adminData).mockResolvedValue(null);
    TransactionHistory.findOne.mockResolvedValue(realTransactionHistoryData);
    req.params.transactionId = 1;
    await TransactionHistoryController.getTransactionHistory(req, res);
    expect(res.statusCode).toBe(500);
  });
  it("should return 503", async () => {
    User.findByPk
      .mockResolvedValueOnce(adminData)
      .mockResolvedValue(transactionHistoryData2);
    TransactionHistory.findOne.mockResolvedValue(
      Promise.reject({ message: "Error" })
    );
    req.params.transactionId = 1;
    await TransactionHistoryController.getTransactionHistory(req, res);
    expect(res.statusCode).toBe(503);
  });
});
