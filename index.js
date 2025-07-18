const http = require("http");
const express = require("express");
const connection = require("./app/database/dbConnection");

const authRoutes = require("./app/src/Routes/AuthRoutes");
const userRoutes = require("./app/src/Routes/UserRoutes");
const vendorRoutes = require("./app/src/Routes/VendorRoutes");
require('dotenv').config();

const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hostname = "127.0.0.1";
const port = 3000;

const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:8082'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/vendor", vendorRoutes);

connection.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.stack);
    return;
  }
  console.log("Connected to DB.");
});

// app.get("/", (req, res) => {
//   connection.query("SELECT 1 + 1 AS solution", (err, results) => {
//     if (err) throw err;
//     res.send(`The solution is: ${results[0].solution}`);
//   });
// });

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
