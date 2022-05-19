const jwt = require("jsonwebtoken");
const privateKey = "supersecret";

const verify = async (req, res, next) => {
  const token = req.headers["token"];
  jwt.verify(token, privateKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const generateToken = (payload) => {
  return jwt.sign(payload, privateKey, { algorithm: "HS256", expiresIn: "1h" });
};

module.exports = {
  verify,
  generateToken,
};
