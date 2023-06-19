require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnector = require("./utils/db");
const { stateRouter } = require("./routes/state.route");
const { lgaRouter } = require("./routes/lga.route");
const { electionRouter } = require("./routes/election.route");
const { partyRouter } = require("./routes/party.route");
const { stateController } = require("./controllers/state.controller");
const { voterRouter } = require("./routes/voter.route");
const { adminRouter } = require("./routes/admin.route");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/load", stateController.loadStatesAndLgas);

app.use("/state", stateRouter);

app.use("/voter", voterRouter);

app.use("/admin", adminRouter);

app.use("/lga", lgaRouter);

app.use("/party", partyRouter);

app.use("/election", electionRouter);

app.use((req, res, next) => {
  res.status(404).send("The route you're visiting does not exist");
});

const PORT = 8080 || process.env.PORT;

dbConnector(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});
