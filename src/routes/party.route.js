const express = require("express");
const { partyController } = require("../controllers/party.controller");

const partyRouter = express.Router();

partyRouter.post("/", partyController.createParty);

partyRouter.get("/", partyController.getParties);

module.exports = {
  partyRouter,
};
