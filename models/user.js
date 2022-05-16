const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  userName: String,
  emai: String,
  password: String,
});

mongoose.exports = mongoose.model("Users", userSchema);
