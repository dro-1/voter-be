const express = require("express");
const { partyController } = require("../controllers/party.controller");

const partyRouter = express.Router();

partyRouter.post("/", partyController.createParty);

module.exports = {
  partyRouter,
};
