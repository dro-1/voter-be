const mongoose = require("mongoose");
const { ELECTION_POSTS } = require("../utils/utils");

const Schema = mongoose.Schema;

const electionSchema = new Schema({
  post: {
    required: true,
    type: String,
    enum: Object.values(ELECTION_POSTS),
  },
  state: {
    ref: "State",
    type: Schema.Types.ObjectId,
  },
  lga: {
    ref: "LGA",
    type: Schema.Types.ObjectId,
  },
  startDate: {
    type: Schema.Types.Date,
    required: true,
  },
  endDate: {
    type: Schema.Types.Date,
    required: true,
  },
  candidates: [
    {
      name: {
        required: true,
        type: String,
      },
      party: {
        ref: "Party",
        type: Schema.Types.ObjectId,
      },
      votes: [
        {
          type: Schema.Types.ObjectId,
          ref: "Voter",
        },
      ],
    },
  ],
});

module.exports = {
  Election: mongoose.model("Election", electionSchema),
};
