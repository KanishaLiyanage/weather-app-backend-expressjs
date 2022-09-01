require('dotenv').config();
require("./connection/mongoose");
const express = require("express");
const User = require("./models/user");
const userRouter = require("./routers/user");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log("Server start on port " + port);
});