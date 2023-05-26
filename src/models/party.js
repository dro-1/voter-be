const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const partySchema = new Schema({
  name: {
    required: true,
    type: String,
    unique: true,
  },
  acronym: {
    reuired: true,
    type: String,
    unique: true,
  },
  logo: {
    required: true,
    type: String,
  },
});

module.exports = {
  Party: mongoose.model("Party", partySchema),
};
