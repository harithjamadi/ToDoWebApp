const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../model/user');

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../view/signup.html');
  res.sendFile(filePath);
});

router.post('/', async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (!username || !email || !password || !passwordConfirm || password !== passwordConfirm) {
      return res.status(400).send('Invalid input or passwords do not match');
  }

  try {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });

      if (existingUser) {
          return res.status(400).send('Username or email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.redirect('/account-created');
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
