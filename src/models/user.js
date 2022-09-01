const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
    // username: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    // password: {
    //     type: String,
    //     required: true,
    //     trim: true
    // }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;