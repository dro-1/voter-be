const express = require("express");
const { lgaController } = require("../controllers/lga.controller");

const lgaRouter = express.Router();

lgaRouter.post("/", lgaController.createLga);

module.exports = {
  lgaRouter,
};
