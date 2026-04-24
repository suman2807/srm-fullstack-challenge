const app = require("./index");

module.exports = (req, res) => {
  if (req.url === "/bfhl" && req.method === "POST") {
    app(req, res);
  } else {
    res.status(404).json({ error: "Not found" });
  }
};
