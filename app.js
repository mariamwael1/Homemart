 require('dotenv').config(); // Loads variables from .env
const express=require('express');
const path = require('path');
const app=express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html')); // Adjust the path to your admin.html file
});

app.listen(3000);