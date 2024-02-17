const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./model/user');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const dbUrl = "mongodb+srv://admin:BvIGoHTolbrzaVfQ@cluster0.lgvxcjd.mongodb.net/InfinityWave?retryWrites=true&w=majority";

mongoose.connect(dbUrl);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbUrl })
}));

app.use('/', require('./route/index'));
app.use('/login', require('./route/login'));
app.use('/signup', require('./route/signup'));
app.use('/dashboard', require('./route/dashboard'));
app.use('/account-created', require('./route/account-created'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
