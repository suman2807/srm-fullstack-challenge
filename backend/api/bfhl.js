const app = require("./index");
const serverless = require("serverless-http");

module.exports = (req, res) => {
  if (req.url === "/bfhl" && req.method === "POST") {
    app(req, res);
  } else {
    res.status(404).json({ error: "Not found" });
  }
};

module.exports = serverless(app);
