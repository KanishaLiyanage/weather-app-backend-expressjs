const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = new express.Router();

router.post('/signup', async (req, res) => {

    var uname = req.body.username;
    var uemail = req.body.email;
    var upassword = req.body.password;

    const user = new User({
        username: uname,
        email: uemail,
        password: upassword
    });

    try {
        await user.save();
        res.send(user);
    } catch (e) {
        console.log(e);
    }
    //console.log(req.body);

});

router.post('/users/signin', async (req, res) => {

    var uname = req.body.username;
    var upassword = req.body.password;

    try {
        const user = await User.findByCredentials(uname, upassword);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        console.log(e);
    }

});

router.get('/users', async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(400).send(e);
    }

});

router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates.' });
    }

    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        await user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }

});

router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }

});

module.exports = router;