const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = "zsrfdcgyujkotrdssdxc";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const users = [];

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    if (!user) {
        return res.status(404).send('User not found');
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
            return res.status(401).send("Incorrect Password");
        }


        const token = jwt.sign({ email: user.email }, SECRET_KEY);
        res.send(token);
    });
});


app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    const userExists = users.find((user) => user.mail === email);
    if (userExists) {
        return res.status(409).send('User already Exists');
    }
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send('Error while hashing');
        }
        const newUser = {
            email: email,
            password: hash,
        };

        users.push(newUser);

        const token = jwt.sign({ email: newUser.email }, SECRET_KEY);
        res.send(token);
    });
});



app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});