const express = require('express');
const connectDB = require('./config/ConnectDb');
require('dotenv').config();
const apiRoutes = require('./routes/ApiRoutes');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: {
      status: 429,
      error: "Too many requests, please try again later.",
    },
  });

const app = express();
app.use(express.json());
app.use(apiRoutes);
app.use(limiter);
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
