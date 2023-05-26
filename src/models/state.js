const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stateSchema = new Schema({
  name: {
    required: true,
    type: String,
    unique: true,
  },
  presidential: {
    type: Schema.Types.Mixed,
    total: {
      required: true,
      type: Number,
    },
    // All parties will be added as fields here
    // with each party telling how much votes it got in this state for presidential election
  },
});

module.exports = {
  State: mongoose.model("State", stateSchema),
};
