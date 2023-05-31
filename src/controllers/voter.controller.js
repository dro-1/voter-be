const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const {
  sendMissingPropertyError,
  sendGenericErrorMessage,
  sendSuccessMessage,
  sendError,
  sendSuccess,
} = require("../utils/utils");
const { Voter } = require("../models/voter");

const registerVoter = async (req, res) => {
  // TODO: Handle case of one user registering twice
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

const login = async (req, res) => {
  const { nin, password } = req.body;

  if (!nin || !password) return sendMissingPropertyError(res);

  let voter;
  try {
    voter = await Voter.findOne({ nin });
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }
  console.log(voter);
  if (!voter) return sendError(res, 401, "Incorrect voter details");

  console.log({ password });
  console.log(voter.password);
  if (voter.password != password)
    return sendError(res, 401, "Incorrect voter details");

  let authToken = jwt.sign(
    {
      voterId: voter.id,
    },
    process.env.AUTH_KEY,
    { expiresIn: "1h" }
  );

  let refreshToken = jwt.sign(
    {
      voterId: voter.id,
    },
    process.env.REFRESH_KEY
  );

  return sendSuccess(res, 200, {
    message: "Voter logged in successfully",
    authToken,
    refreshToken,
  });
};

const refreshAuthToken = async (req, res) => {
  const refToken = req.get("refreshToken");
  if (!refToken) return sendError(res, 401, "Invalid credentials");

  const voter = jwt.verify(refToken, process.env.REFRESH_KEY);

  if (!voter) return sendError(res, 401, "Invalid credentials");

  let authToken = jwt.sign(
    {
      voterId: voter.id,
    },
    process.env.AUTH_KEY,
    { expiresIn: "1h" }
  );

  return sendSuccess(res, 200, {
    message: "Token refreshed successfully",
    authToken,
  });
};

const voterController = {
  registerVoter,
  login,
  refreshAuthToken,
};

module.exports = {
  voterController,
};
