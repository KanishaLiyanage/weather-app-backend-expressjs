require('dotenv').config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

require("./connection/mongoose");
const User = require("./models/user");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/signUp", async(req, res) =>{
    var userName = req.body.userName;
    var password = req.body.password;
    console.log(userName);
    console.log(password);
    User.register({username: userName}, password, function (err, user) {
        if(err){
            console.log(err);
            res.redirect("/signUp");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/home");
            });
        }
    });
});

app.get("/home", async(req, res) => {
    try{
        await res.send("home");
        console.log("success!");
    } catch (e) {
        console.log(e);
    }
});

app.get("/users", async(req, res) => {
    try{
        await res.send("get");
        console.log("success!");
    } catch (e) {
        console.log(e);
    }
});

app.patch("user/:id", async(req, res) => {
    try{

    } catch (e) {
        console.log(e);
    }
});

app.delete("user/:id", async(req, res) => {
    try{

    } catch (e) {
        console.log(e);
    }
});

app.listen(port, () => {
    console.log("Server start on port " + port);
});