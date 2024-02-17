const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../model/user');

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../view/login.html');
  res.sendFile(filePath);
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && user.authenticate(password)) {
      req.session.user = { username: user.username };
      return res.redirect('/dashboard');
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;