const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');
const path = require('path');


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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
    console.log("Login route hit!");
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials!' });
        
        const token = jwt.sign({id:user.id,email:user.email},JWT_SECRET,{expiresIn:'1h'});
        res.cookie('auth_token', token, { httpOnly: true });

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token 
        });

        res.cookie('auth_token', token, { httpOnly: true });

        res.sendFile(path.join(__dirname, '../views/profile.html'));


    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error });
    }
});


router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching user profile.', error: error.message || error });
    }
});


module.exports = router;
