const { State } = require("../models/state");
const { LGA } = require("../models/lga");
const {
  sendGenericErrorMessage,
  sendMissingPropertyError,
  sendSuccessMessage,
  sendError,
  getBaseNinUrl,
  sendSuccess,
  sanitizeState,
  sanitizeLGA,
} = require("../utils/utils");
const { default: axios } = require("axios");

const createState = async (req, res) => {
  const { name } = req.body;
  if (!name) return sendMissingPropertyError(res);

  let state = new State({
    name,
    presidential: {
      total: 0,
    },
  });

  try {
    await state.save();
    return sendSuccessMessage(res, 201, "State created successfully");
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }
};

const getStates = async (req, res) => {
  let states;
  try {
    states = await State.find({});
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  return sendSuccess(res, 200, {
    status: "Successful",
    states: states.map(sanitizeState),
  });
};

const getStateLGAs = async (req, res) => {
  const { stateId } = req.params;
  console.log(stateId);
  let state;
  try {
    state = await State.findById(stateId).populate("lgas");
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  console.log(state);

  if (!state) return sendError(res, 404, "State does not exist");

  return sendSuccess(res, 200, {
    status: "Successful",
    lgas: state.lgas.map((lga) => sanitizeLGA(lga)),
  });
};

const loadStatesAndLgas = async (req, res) => {
  let states;
  try {
    let resp = await axios.get(`${getBaseNinUrl()}/states`, {
      headers: {
        Authorization: `Bearer ${process.env.NIN_KEY}`,
      },
    });

    states = resp.data.states;
  } catch (e) {
    console.log(e);
    console.log(e.response);
    if (e.response?.status == 400 || e.response?.status == 404) {
      return sendError(res, e.response.status, e.response.data.message);
    }

    return sendGenericErrorMessage(res);
  }

  const lgaSavePromises = [];
  const statesSavePromises = states.map((state) => {
    let newState = new State({
      name: state.name,
      presidential: {
        total: 0,
      },
    });

    for (let lga of state.lgas) {
      lga = new LGA({
        name: lga.name,
        state: newState.id,
        gubernatorial: {
          total: 0,
        },
      });
      newState.lgas.push(lga.id);
      lgaSavePromises.push(lga.save());
    }

    return newState.save();
  });

  try {
    await Promise.all(statesSavePromises);
    await Promise.all(lgaSavePromises);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  return sendSuccessMessage(
    res,
    201,
    "States and LGAs were loaded from NIN DB successfully"
  );
};

const stateController = {
  createState,
  loadStatesAndLgas,
  getStates,
  getStateLGAs,
};

module.exports = {
  stateController,
};
