const express = require("express");
const { stateController } = require("../controllers/state.controller");

const Router = express.Router;

const stateRouter = Router();

stateRouter.post("/", stateController.createState);

module.exports = {
  stateRouter,
};
