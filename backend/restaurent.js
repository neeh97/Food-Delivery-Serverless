const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2");
const cors = require("cors");
app.use(cors());
const router = express.Router();

const dbConn = mysql.createConnection({
  user: "root",
  host: "35.222.234.108",
  password: "5410db-password",
  database: "restaurant",
});

router.post("/add/:id", (req, res) => {
  console.log(req.params);
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const restaurant_id = req.params.id;
  console.log("test" + restaurant_id);

  dbConn.query(
    "insert into menu(name, description, price, restaurant_id) values(?,?,?,?)",
    [name, description, price, restaurant_id],
    function (err, result) {
      if (result) {
        res.send({ message: "Added successfully" });
      } else {
        res.send({ message: "No record added" });
      }
      if (err) throw err;
    }
  );
});

router.get("/menulist/:id", (req, res) => {
  var resId = req.params.id;
  dbConn.query(
    "select * from menu where restaurant_id=?",
    [resId],
    function (err, result) {
      if (result.length > 0) {
        console.log(result);
        return res.status(200).json({
          message: "Retrived successfully !",
          success: true,
          body: result,
        });
      } else if (!result.length) {
        return res.status(400).json({
          message: "No records !",
          success: false,
        });
      }
      if (err) throw err;
    }
  );
});

router.put("/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);

  dbConn.query(
    "delete from menu where food_id=?",
    [id],
    function (err, result) {
      if (result.affectedRows == 0) {
        res.send({ message: "No record deleted" });
      }
      if (result.affectedRows > 0) {
        res.send({ message: "Record deleted successfully" });
      }
      if (err) throw err;
    }
  );
});

module.exports = router;
