const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Sign Up
exports.signup = async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ username, password: hashedPassword, role });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ error: 'Error creating user', error });
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username : user.username, role: user.role }, process.env.JWT_SECRET);
    
    res.json({ token });
};
