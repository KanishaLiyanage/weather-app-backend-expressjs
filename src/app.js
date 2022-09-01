require('dotenv').config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
// const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
// app.use(bodyParser.urlencoded({extended:true}));
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

app.post("/signUp", async (req, res) => {
    var user_name = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    try {
        await User.register(
            { username: user_name, email: email },
            password,
            function (err, user) {
                if (err) {
                    console.log(err);
                    res.redirect("/signUp");
                } else {
                    passport.authenticate("local")(req, res, function () {
                        res.send(user);
                        //res.redirect("/home");
                    });
                }
            });
    } catch (e) {
        console.log(e);
    }
});

app.post("/signIn", function (res, req)  {

    var user_name = req.body.username;
    var password = req.body.password;
    console.log(user_name);
    console.log(password);

    // const user = new User({
    //     username: req.body.username,
    //     password: req.body.password
    // });
    // try {
    //     req.login(user, function(err) {
    //         if(err){
    //             console.log(e);
    //         }else{
    //             passport.authenticate("local")(req, res, function(){
    //                 res.send(user);
    //                 //res.redirect("/home");
    //             });
    //         }
    //     });
    // } catch (e) {
    //     console.log(e);
    // }
});

app.get("/users", async (req, res) => {
    if(req.isAuthenticated()){
        try {
            await res.send("get");
            console.log("success!");
        } catch (e) {
            console.log(e);
        }
    }else{
        //res.redirect("/login");
    }
});

app.patch("user/:id", async (req, res) => {
    if(req.isAuthenticated()){
        try {
            await res.send("get");
            console.log("success!");
        } catch (e) {
            console.log(e);
        }
    }else{
        //res.redirect("/login");
    }
});

app.delete("user/:id", async (req, res) => {
    if(req.isAuthenticated()){
        try {
            await res.send("get");
            console.log("success!");
        } catch (e) {
            console.log(e);
        }
    }else{
        //res.redirect("/login");
    }
});

app.listen(port, () => {
    console.log("Server start on port " + port);
});