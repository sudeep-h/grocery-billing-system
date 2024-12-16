const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');


const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Request body----",req.body);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password:hashedPassword });
        console.log("new user-->",newUser);
        res.status(201).json({ message: 'User registered successfully!', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials!' });

        res.status(200).json({ message: 'Login successful!', user });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error });
    }
});

module.exports = router;
