const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: String,
  email: String,
  password: { type: String, min: 8 },
  todos: [],
});

const userModel = new mongoose.model("User", schema);
module.exports = userModel;
