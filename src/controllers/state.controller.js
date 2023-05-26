const { State } = require("../models/state");
const statesAndLgaObj = require("./../json/states_and_lga.json");
const {
  sendGenericErrorMessage,
  sendMissingPropertyError,
  sendSuccess,
  sendSuccessMessage,
} = require("../utils/utils");
const { LGA } = require("../models/lga");

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

const loadStates = async (req, res) => {
  for (let state in statesAndLgaObj) {
    let createdState = new State({
      name: state,
      presidential: {
        total: 0,
      },
    });

    try {
      createdState = await createdState.save();
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }
    console.log(createdState.id);
    const lgas = statesAndLgaObj[state];
    const lgaSavePromises = lgas.map((lga) => {
      let createdLga = new LGA({
        name: lga,
        state: createdState.id,
        gubernatorial: {
          total: 0,
        },
      });
      return createdLga.save();
    });

    let response = await Promise.all(lgaSavePromises);
  }
  sendSuccessMessage(res, 200, "States and LGAs loaded successfully");
};

const stateController = {
  createState,
  loadStates,
};

module.exports = {
  stateController,
};
