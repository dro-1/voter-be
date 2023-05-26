const { default: axios } = require("axios");
const {
  sendMissingPropertyError,
  sendGenericErrorMessage,
  sendSuccessMessage,
  sendError,
} = require("../utils/utils");
const { Voter } = require("../models/voter");

const registerVoter = async (req, res) => {
  const { nin, password, votingPassword } = req.body;
  if (!nin || !password || !votingPassword)
    return sendMissingPropertyError(res);
  let person;
  try {
    let resp = await axios.post(
      "https://fake-nin.onrender.com/getPerson",
      {
        nin,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NIN_KEY}`,
        },
      }
    );

    person = resp.data.person;
  } catch (e) {
    console.log(e.response);
    if (e.response.status == 400 || e.response.status == 404) {
      return sendError(res, e.response.status, e.response.data.message);
    }

    return sendGenericErrorMessage(res);
  }

  const voter = new Voter({
    firstName: person.firstName,
    lastName: person.lastName,
    middleName: person.middleName,
    nin: person.nin,
    address: person.address,
    gender: person.gender,
    imageUrl: person.imageUrl,
    stateOfOrigin: person.stateOfOrigin,
    lgaOfOrigin: person.firstName,
    password: votingPassword,
  });

  try {
    await voter.save();
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  return sendSuccessMessage(res, 201, "Voter registered successfully");
};

const voterController = {
  registerVoter,
};

module.exports = {
  voterController,
};
