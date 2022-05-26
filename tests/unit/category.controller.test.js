const CategoryController = require("../../controllers/category.controller");
const httpMocks = require("node-mocks-http");
const { Category, User } = require("../../models");

jest.mock("../../models/");

let req, res;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});
beforeEach(() => {
  jest.clearAllMocks();
});

const categoryData = {
  id: 1,
  type: "Makanan Kering",
};

const updateCategoryData = [
  {},
  {
    dataValues: {
      id: 1,
      type: "Makanan Kering",
      createdAt: "2022-01-01",
      updatedAt: "2022-02-02",
      sold_product_amount: 0,
    },
  },
];

const adminData = {
  role: "admin",
};
const userData = {
  role: "customer",
};

describe("CategoryController.getCategory", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.findAll.mockResolvedValue(categoryData);
    await CategoryController.getCategory(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await CategoryController.getCategory(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(adminData);
    const rejected = Promise.reject({ message: "Error" });
    Category.findAll.mockResolvedValue(rejected);
    await CategoryController.getCategory(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("CategorController.postCategory", () => {
  it("should return 201", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.create.mockResolvedValue(categoryData);
    await CategoryController.postCategory(req, res);
    expect(res.statusCode).toBe(201);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await CategoryController.postCategory(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValue(adminData);
    const rejected = Promise.reject({ message: "Error" });
    Category.create.mockResolvedValue(rejected);
    await CategoryController.postCategory(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("CategoryController.patchCategory", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.update.mockResolvedValue(updateCategoryData);
    await CategoryController.patchCategory(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await CategoryController.patchCategory(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 500", async () => {
    User.findByPk.mockResolvedValue(adminData);
    const rejected = Promise.reject({ message: "Error" });
    Category.update.mockResolvedValue(rejected);
    await CategoryController.patchCategory(req, res);
    expect(res.statusCode).toBe(500);
  });
  it("should return 503", async () => {
    User.findByPk.mockResolvedValueOnce(adminData).mockResolvedValue(null);
    await CategoryController.patchCategory(req, res);
    expect(res.statusCode).toBe(503);
  });
});

describe("CategoryController.deleteCategory", () => {
  it("should return 200", async () => {
    User.findByPk.mockResolvedValue(adminData);
    Category.destroy.mockResolvedValue({ id: 1 });
    await CategoryController.deleteCategory(req, res);
    expect(res.statusCode).toBe(200);
  });
  it("should return 401", async () => {
    User.findByPk.mockResolvedValue(userData);
    await CategoryController.deleteCategory(req, res);
    expect(res.statusCode).toBe(401);
  });
  it("should return 500", async () => {
    User.findByPk.mockResolvedValue(adminData);
    const rejected = Promise.reject({ message: "Error" });
    Category.destroy.mockResolvedValue(rejected);
    await CategoryController.deleteCategory(req, res);
    expect(res.statusCode).toBe(500);
  });
});
