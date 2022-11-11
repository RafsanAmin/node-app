const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  desc: String,
  date: {
    day: Number,
    month: String,
    yr: Number,
  },
  time: {
    hr: Number,
    min: Number,
    ap: { type: String, enum: ["AM", "PM"] },
  },
  checked: Boolean,
  user: {
    type: mongoose.Types.ObjectId,
    refe: "User",
  },
});

const todoModel = new mongoose.model("todo", schema);
module.exports = todoModel;
