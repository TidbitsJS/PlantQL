const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  name: String,
  scientificName: String,
  family: String,
  description: String,
  userId: String,
});

module.exports = mongoose.model("Plants", plantSchema);
