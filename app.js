const express = require("express");
const app = express();
const path = require("path");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

require("dotenv").config();
require("./config/mongoose");
const dbgr = require("debug")("development:App");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
require("./config/google-oauth-config");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const paymentRouter = require("./routes/payment");
const orderRouter = require("./routes/order");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRouter);
app.use("/order", orderRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  dbgr(`Server is running on http://localhost:4000`);
});
