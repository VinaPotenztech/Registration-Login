const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: String,
  resetToken: { type: String, default: null },
  resetTokenExpires:{type:Date,default:null}
  // New field for reset token

});

const User = mongoose.model('User', userSchema);
module.exports = User;
