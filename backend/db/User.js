const mongoose = require('mongoose');
const nodemon = require('nodemon');

const userSchema = new mongoose.Schema({
    name : String,
    email: String,
    password: String
});

module.exports = mongoose.model("users", userSchema);