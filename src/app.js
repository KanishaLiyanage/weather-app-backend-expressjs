const express = require("express");
const port = process.env.PORT || 3000;

const app = express();

app.post("/user", async(req, res) =>{
    await res.send("user created!");
    console.log("success!");
});

app.get("/users", async(req, res) => {
    await res.send("get");
    console.log("success!");
});

app.patch("user/:id", async(req, res) => {

});

app.delete("user/:id", async(req, res) => {
    
});

app.listen(port, () => {
    console.log("Server start on port " + port);
});