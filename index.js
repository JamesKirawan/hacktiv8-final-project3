require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const transactionhistoryRoutes = require("./routes/transactionhistory");

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionhistoryRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
