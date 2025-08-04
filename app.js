require("dotenv").config();
const connectDB = require("./db/connect");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const connect = require("./db/connect");
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/SDN301M_PE_FA24";
connectDB(MONGO_URI);
const PORT = process.env.PORT || 3000;
console.log("Server running on port: " + PORT);
const Category = require("./models/category.model");
const Product = require("./models/product.model");
const User = require("./models/user.model");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRouter = require("./routes/auth.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
