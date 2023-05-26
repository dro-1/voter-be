const axios = require("axios");
const { sendError, sendSuccess } = require("../utils/utils");
const { Election } = require("../models/election");

const registerVoter = async (req, res) => {
  const { nin, password } = req.body;

  if (!nin || !password)
    return sendError(res, 400, "All necessary details must be provided");

  let person = new Election({
    nin,
    firstName,
    lastName,
    middleName: middleName || "",
    gender,
    address,
    password,
    imageUrl,
  });

  try {
    await person.save();
    return res.status(201).send({
      status: "Successful",
      message: "Person created successfully",
      nin: nin,
    });
  } catch (e) {
    console.log(e);
  }
};

const createElection = async (req, res) => {
  const { post, candidates } = req.body;

  if (!post || !candidates)
    return sendError(res, 400, "All necessary details must be provided");
};

const getPerson = async (req, res) => {
  const { nin, password } = req.body;

  if (!nin || !password)
    return res.status(400).send({
      status: "Failed",
      message: "All necessary details must be provided",
    });

  let person;
  try {
    person = await Person.findOne({ nin });
  } catch (e) {
    console.log(e);
  }

  if (person && person.password === password) {
    return res.status(200).send({
      status: "Successful",
      person: sanitizePerson(person),
    });
  } else {
    return res.status(404).send({
      status: "Failed",
      message: "Person not found",
    });
  }
};

const electionController = {};

module.exports = {
  electionController,
};
