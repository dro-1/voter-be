const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lgaSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  state: {
    type: Schema.Types.ObjectId,
    ref: "State",
    required: true,
  },
  gubernatorial: {
    type: Schema.Types.Mixed,
    total: {
      default: 0,
      type: Number,
    },
    // All parties will be added as fields here
    // with each party telling how much votes it got in this lga for governorship election
  },
});

module.exports = {
  LGA: mongoose.model("LGA", lgaSchema),
};
