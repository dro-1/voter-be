const express = require("express");
const { voterController } = require("../controllers/voter.controller");

const voterRouter = express.Router();

voterRouter.post("/register", voterController.registerVoter);

module.exports = {
  voterRouter,
};
