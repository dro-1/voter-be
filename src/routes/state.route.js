const express = require("express");
const { stateController } = require("../controllers/state.controller");

const Router = express.Router;

const stateRouter = Router();

stateRouter.post("/", stateController.createState);

stateRouter.get("/", stateController.getStates);

stateRouter.get("/:stateId/lga", stateController.getStateLGAs);

module.exports = {
  stateRouter,
};
