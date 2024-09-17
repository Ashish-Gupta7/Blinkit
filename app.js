const express = require("express");
const app = express();

const indexRouter = require("./routes/index");

app.get("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
