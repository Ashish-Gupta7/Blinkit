const express = require("express");
const app = express();
const path = require("path");
const expressSession = require("express-session");

require("dotenv").config();
require("./config/google-oauth-config");
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

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

app.use("/", indexRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  dbgr(`Server is running on http://localhost:3000`);
});
