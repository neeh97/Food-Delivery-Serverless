const express = require("express");
const PORT = process.env.PORT || 2000;
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
const router = require("./restaurent");
const order = require("./order");
const review = require("./review");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
  });

app.use(router);
app.use(order);
app.use(review);

app.listen(PORT, function () {
  console.log(`Listening on Port ${PORT}`);
});

