const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true}
});

userSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

const User = mongoose.model('User', userSchema);

module.exports = User;

