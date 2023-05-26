const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const electionSchema = new Schema({
  post: {
    required: true,
    type: String,
  },
  isLocked: {
    required: true,
    type: Boolean,
    default: true,
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

module.exports = { Election: mongoose.model("Election", electionSchema) };
