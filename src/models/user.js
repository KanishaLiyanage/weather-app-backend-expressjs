const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password".');
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
    
});

userSchema.methods.generateAuthToken = async function () {

    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisismytoken');

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;

}

userSchema.statics.findByCredentials = async (username, password) => {

    const user = await User.findOne({username: username});

    if(!user){
        throw new Error("Unable to log in.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to log in.");
    }

    return user;

}

userSchema.pre('save', async function(next){
    const user = this;

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, saltRounds);
    }

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;