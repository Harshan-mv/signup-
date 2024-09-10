const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (like CSS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/register', (req, res) => {
    const { email, name, password, mobile } = req.body;

    const filePath = path.join(__dirname, 'users.json');
    let users = [];

    if (fs.existsSync(filePath)) {
        users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        res.send('<h1>User already registered! Please login.</h1><a href="/login">Go to Login</a>');
    } else {
        users.push({ email, name, password, mobile });
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
        res.send('<h1>Registration successful!</h1><a href="/login">Go to Login</a>');
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const filePath = path.join(__dirname, 'users.json');
    let users = [];

    if (fs.existsSync(filePath)) {
        users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        res.send(`<h1>Login successful! Welcome, ${user.name}!</h1>`);
    } else {
        res.redirect('/register');  // Redirect to registration if user is not registered
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
