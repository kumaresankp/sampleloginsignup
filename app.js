const express = require('express');
const mysql = require("mysql")
const dotenv = require('dotenv')
const bcrypt = require("bcryptjs")
const app = express();

app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())

dotenv.config({ path: './.env' })

const db = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_kumaresan",
    password: "vZ425DB!2EzVPGr",
    database: "freedb_login-db"
})

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.set('view engine', 'hbs')

const path = require("path")

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))



app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/auth/register", (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async(error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            });
        } else {


            db.query('INSERT INTO users SET ?', { name: name, email: email, passsword: password }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.render('login', {
                        message: 'User registered!'
                    });
                }
            });
        }
    });
});

app.post("/auth/login", (req, res) => {
    const { name, password } = req.body;

    db.query('SELECT * FROM users WHERE name = ? OR email = ?', [name, name], async(error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length === 0) {
            return res.render('login', {
                message: 'Invalid name or password'
            });
        }

        const user = results[0];

        if (password !== user.passsword) {
            return res.render('login', {
                message: 'Invalid name or password'
            });
        }

        return res.render('index', {
            message: 'Logged in successfully!'
        });
    });
});


app.listen(5000, () => {
    console.log("server started on port 5000")
})