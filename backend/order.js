const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2");
const cors = require("cors");
const moment = require("moment");
app.use(cors());
const router = express.Router();

const dbConn = mysql.createConnection({
  user: "root",
  host: "35.222.234.108",
  password: "5410db-password",
  database: "restaurant",
});

  
router.get('/allRestaurants', (req, res) => {
    dbConn.query(
        "SELECT * FROM restaurant",
        function (err, result) {
            if (result.length > 0) {
                return res.status(200).json({
                  message: "Restaurants retrieved!",
                  success: true,
                  body: result,
                });
              } else if (!result.length) {
                return res.status(400).json({
                  message: "No restaurants!",
                  success: false,
                });
              }
              if (err) throw err;
            }
    );
});

router.get('/getUser/:email', (req, res) => {
  var email = req.params.email;
  dbConn.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    function (err, result) {
        if (result.length > 0) {
            return res.status(200).json({
              message: "User retrieved",
              success: true,
              body: result,
            });
          } else if (!result.length) {
            return res.status(400).json({
              message: "No such user!",
              success: false,
            });
          }
          if (err) throw err;
        }
);
});

router.post('/placeOrder', (req, res) => {
    const items = req.body.items;
    const restaurantId = req.body.restaurant_id;
    const userId = parseInt(req.body.user_id);
    const totalPrice = req.body.total_price;
    const status = 'production';
    const now = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    dbConn.query(
        "insert into orders(orderStatus,menuItems,restaurant_id,user_id,total_price,order_placed_on) values(?,?,?,?,?,?)",
        [status,items,restaurantId,userId,totalPrice,now],
        function (err, result) {
            if (result) {
              setTimeout(updateOrderStatus,60*1000*15,result.insertId,'dispatched');
              res.send({ message: "Added successfully" });
            } else {
              res.send({ message: "No record added" });
            }
            if (err) {
                throw err;}
          }
    );
});

function updateOrderStatus(orderId, status) {
  if (status == 'dispatched') {
    setTimeout(updateOrderStatus,60*1000*15,orderId,'delivered');
  }
  dbConn.query(
    "UPDATE orders set orderStatus = ? WHERE orderId = ?",
    [status, orderId],
    function (err, result) {
      if (result) {
        return "Successful";
      }
      if (err) {
        throw err;
      }
    }
  )
}

module.exports = router;