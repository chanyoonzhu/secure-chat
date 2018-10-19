/* MONGOOSE SETUP */

const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
mongoose.connect('mongodb://localhost/myDatabase');

const Schema = mongoose.Schema;
const UserDetail = new Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      salt: {type: String, required: true}
    });

UserDetail.plugin(uniqueValidator);

const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

module.exports = UserDetails;