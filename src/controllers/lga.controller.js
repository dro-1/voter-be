const { LGA } = require("../models/lga");
const { State } = require("../models/state");
const {
  sendMissingPropertyError,
  sendSuccess,
  sendSuccessMessage,
  sendGenericErrorMessage,
  sendError,
} = require("../utils/utils");

const createLga = async (req, res) => {
  const { name, stateId } = req.body;

  if (!name || !stateId) return sendMissingPropertyError(res);

  let state;

  try {
    state = await State.findById(stateId);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!state) return sendError(res, 404, "State with state id not found");

  const lga = new LGA({
    name,
    state: stateId,
    gubernatorial: {
      total: 0,
    },
  });

  try {
    await lga.save();
    return sendSuccessMessage(res, 201, "LGA created successfully");
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }
};

const lgaController = {
  createLga,
};

module.exports = {
  lgaController,
};
