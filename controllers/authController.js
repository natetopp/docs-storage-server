const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signupUser = (req, res) => {
    const { username, password, isAdmin, uploadedDocuments } = req.body;

    UserModel
        .findOne({ username })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ message: 'This username is taken' });
            }

            if (username.includes(' ')) {
                return res.status(401).json({ message: 'Username cannot contain space characters' });
            }

            if (username.length < 5 || username.length > 20) {
                return res.status(402).json({ message: 'Username must be from 5 to 20 characters' });
            }

            if (password && password.length < 8 ||
                !/[A-Z]/.test(password) ||
                !/[a-z]/.test(password) ||
                !/[0-9]/.test(password)) {
                return res.status(403).json({ message: 'Password cannot be shorter than 8 characters, must contatin only latin letters and include an uppercase letter, a lowercase letter, and a number' });
            }

            bcrypt.hash(password, 10, (err, hashedPswrd) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }

                const newUser = new UserModel({
                    username: username,
                    password: hashedPswrd,
                    isAdmin: isAdmin,
                    uploadedDocuments: uploadedDocuments,
                });

                newUser.save()
                    .then(() => {
                        res.status(201).json({ message: 'Signed up successfully' });
                    })
                    .catch((error) => {
                        res.status(500).json({ message: 'Error signing up', error: error });
                    });
            });
        }).catch((error) => {
            res.status(500).json({ message: 'Error checking username', error: error });
        });
};

const loginUser = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    UserModel
        .findOne({ username })
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.status(500).json({ message: 'Error logging in', error: err });
                    }
                    if (result) {
                        let token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, 'verySecretValue', { expiresIn: '8h' });
                        res.status(200).json({ message: 'Logged in successfully', token: token });
                    } else {
                        res.status(400).json({ message: 'Wrong password' });
                    }
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error logging in', error: error });
        });
}

/*const getUser = (req, res) => {
    const username = req.params.username;

    UserModel
        .findOne({ username })
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error retrieving users', error: error });
        });
}*/

module.exports = { signupUser, loginUser };