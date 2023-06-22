const express = require("express");
const { electionController } = require("../controllers/election.controller");
const { middlewares } = require("../middleware/middlewares");

const electionRouter = express.Router();

electionRouter.post("/", electionController.createElection);

electionRouter.get(
  "/",
  middlewares.checkVoterOrAdminAuth,
  electionController.fetchElections
);

electionRouter.get("/results", electionController.fetchElectionResults);

electionRouter.post(
  "/vote",
  middlewares.checkVoterAuth,
  electionController.vote
);

module.exports = {
  electionRouter,
};
