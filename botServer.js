require("dotenv").config();
const express = require("express");
const { urlencoded } = require("body-parser");

const app = express();
app.use(urlencoded({ extended: false }));

// what does the bot need to do

app.listen(3001, () => {
  console.log("Example app listening on port 3000!");
});
