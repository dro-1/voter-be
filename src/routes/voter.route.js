const express = require("express");
const { voterController } = require("../controllers/voter.controller");
const voter = require("../models/voter");

const voterRouter = express.Router();

voterRouter.post("/register", voterController.registerVoter);

voterRouter.post("/login", voterController.login);

voterRouter.get("/refresh", voterController.refreshAuthToken);

module.exports = {
  voterRouter,
};
