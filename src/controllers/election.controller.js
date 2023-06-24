const {
  sendError,
  sendSuccess,
  sendSuccessMessage,
  sendMissingPropertyError,
  ELECTION_POSTS,
  sanitizePresidentialElection,
  sendGenericErrorMessage,
  sanitizeGubernatorialElection,
  sanitizeLGAElection,
} = require("../utils/utils");
const { Election } = require("../models/election");
const { State } = require("../models/state");
const { LGA } = require("../models/lga");
const { Party } = require("../models/party");

const createElection = async (req, res) => {
  const { post, candidates, state, lga, startDate, endDate } = req.body;

  if (!post || !candidates || !startDate || !endDate)
    return sendMissingPropertyError(res);

  if (!candidates?.length)
    return sendError(res, 400, "Candidates array can not be empty");

  if (!Object.values(ELECTION_POSTS).includes(post))
    return sendError(res, 400, "Invalid Election Post");

  if (post === ELECTION_POSTS.GUBERNATORIAL && !state)
    return sendError(res, 400, "Gubernatorial Election must have a state");

  if (post === ELECTION_POSTS.LGA && (!state || !lga))
    return sendError(
      res,
      400,
      "Local Government Chairman Election must have a state and LGA"
    );

  if (typeof startDate !== "string")
    return sendError(res, 400, "Start Date must be a Date ISO string");

  if (typeof endDate !== "string")
    return sendError(res, 400, "End Date must be a Date ISO string");

  //ensure the parties of all candidates are valid
  let newCandidates = [];
  for (let candidate of candidates) {
    let party;
    try {
      party = await Party.findOne({ acronym: candidate.party });
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }

    if (!party)
      return sendError(
        res,
        404,
        `Party for candidate, ${candidate.name}, does not exist.`
      );

    newCandidates.push({ ...candidate, party: party.id, votes: [] });
  }

  //ensure there is only one presidnetial election
  let presidentialElection;

  try {
    presidentialElection = await Election.findOne({
      post: ELECTION_POSTS.PRESIDENTIAL,
    });
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (presidentialElection && post === ELECTION_POSTS.PRESIDENTIAL)
    return sendError(res, 400, "There can be only 1 presidential election");

  let election = new Election({
    post,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    candidates: newCandidates,
  });

  if (post === ELECTION_POSTS.GUBERNATORIAL || post === ELECTION_POSTS.LGA)
    election["state"] = state;

  if (post === ELECTION_POSTS.LGA) election["lga"] = lga;

  try {
    await election.save();
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  return sendSuccessMessage(res, 201, "Election created successfully");
};

const fetchElections = async (req, res) => {
  let user = req.user;
  //If user has stateOfOrigin, then he is just a voter
  if (user.stateOfOrigin) {
    const elections = [];

    let presidentialElection;
    try {
      presidentialElection = await Election.findOne({
        post: ELECTION_POSTS.PRESIDENTIAL,
      }).populate("candidates.party");
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }

    let stateElection;

    try {
      let state = await State.findOne({ name: user.stateOfOrigin });
      if (!state) throw "State doesn't have an election";

      stateElection = await Election.findOne({ state: state.id }).populate(
        "candidates.party"
      );

      if (stateElection) stateElection.stateName = state.name;
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }

    let lgaElection;

    try {
      let lga = await LGA.findOne({ name: user.lgaOfOrigin });
      if (!lga) throw "LGA doesn't have an election";

      lgaElection = await Election.findOne({ lga: lga.id }).populate(
        "candidates.party"
      );
      if (lgaElection) lgaElection.lgaName = lga.name;
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }

    return sendSuccess(res, 200, {
      elections: {
        presidential: presidentialElection
          ? sanitizePresidentialElection(presidentialElection)
          : null,
        state: stateElection
          ? sanitizeGubernatorialElection(stateElection)
          : null,
        lga: lgaElection ? sanitizeLGAElection(lgaElection) : null,
      },
    });
  }
};

const fetchElectionResults = async (req, res) => {
  let elections;
  try {
    elections = await Election.find({})
      .populate("state")
      .populate("candidates.party")
      .populate("lga");
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  return sendSuccess(res, 200, {
    elections: elections.map(sanitizePresidentialElection),
  });

  try {
    states = await State.find({});
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }
};

const vote = async (req, res) => {
  let { electionId, partyAcronym } = req.body;

  if (!electionId || !partyAcronym) return sendMissingPropertyError(res);

  let election;
  try {
    election = await Election.findById(electionId).populate("candidates.party");
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!election) return sendError(res, 404, "Election does not exist");

  let party;
  try {
    party = await Party.findOne({ acronym: partyAcronym });
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!party) return sendError(res, 404, "Party does not exist");

  if (
    (election.post === ELECTION_POSTS.PRESIDENTIAL &&
      req.voter.hasVoted.presidential) ||
    (election.post === ELECTION_POSTS.GUBERNATORIAL &&
      req.voter.hasVoted.state) ||
    (election.post === ELECTION_POSTS.LGA && req.voter.hasVoted.lga)
  )
    return sendError(res, 400, "User has voted for this election already");

  election.candidates = election.candidates.map((candidate) => {
    if (candidate.party.acronym !== partyAcronym) return candidate;
    candidate.votes.push(req.voter.id);
    return candidate;
  });

  let voter = req.voter;

  //update state for presidential election
  if (election.post === ELECTION_POSTS.PRESIDENTIAL) {
    try {
      let state = await State.findOne({ name: req.voter.stateOfOrigin });
      state.presidential[partyAcronym] += 1;
      state.presidential.total += 1;
      await state.save();
      voter.hasVoted.presidential = true;
      await voter.save();
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }
  }

  //Update lga for gubernatorial election
  if (election.post === ELECTION_POSTS.GUBERNATORIAL) {
    try {
      let lga = await LGA.findOne({ name: req.voter.lgaOfOrigin });
      lga.gubernatorial[partyAcronym] += 1;
      lga.gubernatorial.total += 1;
      await lga.save();
      voter.hasVoted.state = true;
      await voter.save();
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }
  }

  if (election.post === ELECTION_POSTS.LGA) {
    try {
      voter.hasVoted.lga = true;
      await voter.save();
    } catch (e) {
      console.log(e);
      return sendGenericErrorMessage(res);
    }
  }

  try {
    await election.save();
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  return sendSuccessMessage(res, 201, "Your vote has been cast successfully");
};

const electionController = {
  createElection,
  fetchElections,
  vote,
  fetchElectionResults,
};

module.exports = {
  electionController,
};
