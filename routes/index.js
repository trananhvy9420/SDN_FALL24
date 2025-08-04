var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("auth", { title: "Express" });
});
router.get("/login", function (req, res, next) {
  res.render("auth", { title: "Express" });
});
router.get("/signin", function (req, res, next) {
  res.render("auth", { title: "Express" });
});
router.get("/products", function (req, res, next) {
  res.render("products", { title: "Express" });
});
router.get("/product/:id", function (req, res, next) {
  res.render("productdetail", { title: "Express" });
});
module.exports = router;
