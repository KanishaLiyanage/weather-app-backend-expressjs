require('dotenv').config();
require("./connection/mongoose");
const express = require("express");
const User = require("./models/user");
const userRouter = require("./routers/user");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log("Server start on port " + port);
});