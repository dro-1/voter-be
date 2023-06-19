const { LGA } = require("../models/lga");
const { Party } = require("../models/party");
const { State } = require("../models/state");
const {
  sendGenericErrorMessage,
  sendMissingPropertyError,
  sendSuccessMessage,
  sendError,
  sendSuccess,
  sanitizeParty,
} = require("../utils/utils");

const createParty = async (req, res) => {
  let { name, logo, acronym } = req.body;
  if (!name || !logo || !acronym) return sendMissingPropertyError(res);

  acronym = acronym.toUpperCase();

  let states;

  try {
    states = await State.find({});
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!states || !states.length)
    return sendError(
      res,
      400,
      "All states must be filled before adding any party"
    );

  let lgas;

  try {
    lgas = await LGA.find({});
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!lgas || !lgas.length)
    return sendError(
      res,
      400,
      "All LGAs must be filled before adding any party"
    );

  // add the party to all states and all lgas
  let statesSavePromises = states.map((state) => {
    state.presidential[acronym] = 0;
    state.markModified("presidential");
    return state.save();
  });

  try {
    let res = await Promise.all(statesSavePromises);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  let lgaSavePromises = lgas.map((lga) => {
    lga.gubernatorial[acronym] = 0;
    lga.markModified("gubernatorial");
    return lga.save();
  });

  try {
    let res = await Promise.all(lgaSavePromises);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  let party = new Party({
    acronym,
    name,
    logo,
  });

  try {
    await party.save();
    return sendSuccessMessage(res, 201, "Party created successfully");
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }
};

const getParties = async (req, res) => {
  try {
    let parties = await Party.find({});
    sendSuccess(res, 200, {
      message: "Succcess",
      parties: parties.map(sanitizeParty),
    });
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }
};

const partyController = {
  createParty,
  getParties,
};

module.exports = {
  partyController,
};
