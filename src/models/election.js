const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ELECTION_POSTS = [
  "Presidential",
  "Gubernatorial",
  "Local Government Chairman",
];

const electionSchema = new Schema({
  post: {
    required: true,
    type: String,
    enum: ELECTION_POSTS,
  },
  state: {
    ref: "State",
    type: Schema.Types.ObjectId,
  },
  lga: {
    ref: "LGA",
    type: Schema.Types.ObjectId,
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
  ELECTION_POSTS,
};
