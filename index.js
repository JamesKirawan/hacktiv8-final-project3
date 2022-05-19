require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
