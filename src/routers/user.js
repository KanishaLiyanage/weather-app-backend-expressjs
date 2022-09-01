const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");

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
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
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
        res.status(200).send({ user, token });
    } catch (e) {
        console.log(e);
    }

});

router.get('/users/me', auth, async (req, res) => {

    res.status(200).send(req.user);
    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (e) {
    //     res.status(400).send(e);
    // }

});

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }

});

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }

});

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates.' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }

});

router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }

});

module.exports = router;