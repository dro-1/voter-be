const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voterSchema = new Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  nin: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    enum: ["M", "F"],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  stateOfOrigin: {
    type: String,
    required: true,
  },
  lgaOfOrigin: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hasVoted: {
    presidential: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Boolean,
      default: false,
    },
    lga: {
      type: Boolean,
      default: false,
    },
  },
  votedElections: {
    type: Schema.Types.ObjectId,
    ref: "Election",
  },
});

module.exports = {
  Voter: mongoose.model("Voter", voterSchema),
};
