const express = require("express");
const app = express();
require("dotenv").config();
require("./config/mongoose");
const dbgr = require("debug")("development:App");

const indexRouter = require("./routes/index");

app.get("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  dbgr(`Server is running on http://localhost:3000`);
});
