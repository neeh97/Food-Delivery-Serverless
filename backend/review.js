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

router.get('/orderHistory/:id', (req, res) => {
    var userId = req.params.id;
    var responseData = [];
    dbConn.query(
        "SELECT * FROM orders WHERE user_id=? ORDER BY order_placed_on DESC",
        [userId],
        function (err, result) {          
            result.map((row) => {
                var responseObject = {};
                responseObject["orderId"] = row.orderId;
                responseObject["price"] = row.total_price;
                responseObject["restaurantId"] = row.restaurant_id;
                // responseObject["restuarantName"] = await getRestaurantName(row.restaurant_id);
                
                responseData.push(responseObject);
            });
            return res.status(200).json({
                message: "Orders recieved",
                success: true,
                body: responseData,
              });
        }
    );
});

router.get('/order/:id', (req,res) => {
    var orderId = req.params.id;
    dbConn.query(
        "SELECT * FROM orders WHERE orderId =?",
        [orderId],
        function (err, result) {
            if (result) {
                return res.status(200).json({
                    message: "Order data retrieved",
                    success: true,
                    body: result,
                  });
            } else {
                return res.status(400).json({
                    message: "Order not found",
                    success: false,
                });
            }
        }
    );
});

router.post('/postReview', (req,res) => {
    const orderId = req.body.orderId;
    const review = req.body.review;

    dbConn.query(
        "UPDATE orders SET review = ? WHERE orderId=?",
        [review, orderId],
        function (err, result) {
            if (result) {
              res.send({ message: "Review updated successfully" });
            } else {
              res.send({ message: "Update failed" });
            }
            if (err) {
                throw err;}
          }
    )
});

function getRestaurantName(restuarantId) {
    return new Promise((resolve, reject) => {
    dbConn.query(
        "SELECT * FROM restaurant WHERE restaurant_id = ?",
        [restuarantId],
        (err, result) => {
           return err ? reject(err) : resolve(result[0].restaurant_name);
        }
    );
    });
}

module.exports = router;