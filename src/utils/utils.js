const sanitizeVoter = (voter) => ({
  firstName: voter.firstName,
  lastName: voter.lastName,
  nin: voter.nin,
  middleName: voter.middleName,
  gender: voter.gender,
  address: voter.address,
  imageUrl: voter.imageUrl,
});

const sanitizeAdmin = (admin) => ({
  name: admin.name,
  email: admin.email,
});

const sanitizePresidentialElection = (election) => {
  let obj = {
    id: election.id,
    post: election.post,
    startDate: election.startDate,
    endDate: election.endDate,
    candidates: election.candidates.map(({ name, party, votes }) => ({
      name,
      party: sanitizeParty(party),
      votes: votes.length,
    })),
  };
  if (typeof election.state === "object" && election.state !== null)
    obj["state"] = sanitizeState(election.state);
  if (typeof election.lga === "object" && election.lga !== null)
    obj["lga"] = sanitizeLGA(election.lga);
  return obj;
};

const sanitizeGubernatorialElection = (election) => {
  return {
    id: election.id,
    post: election.post,
    startDate: election.startDate,
    endDate: election.endDate,
    state: election.state,
    stateName: election.stateName,
    candidates: election.candidates.map(({ name, party, votes }) => ({
      name,
      party: sanitizeParty(party),
      votes: votes.length,
    })),
  };
};

const sanitizeLGAElection = (election) => ({
  id: election.id,
  post: election.post,
  startDate: election.startDate,
  endDate: election.endDate,
  state: election.state,
  lga: election.lga,
  lgaName: election.lgaName,
  candidates: election.candidates.map(({ name, party, votes }) => ({
    name,
    party: sanitizeParty(party),
    votes: votes.length,
  })),
});

const sanitizeState = (state) => ({
  name: state.name,
  id: state.id,
});

const sanitizeParty = (party) => ({
  id: party.id,
  name: party.name,
  acronym: party.acronym,
  logo: party.logo,
});

const sanitizeLGA = (lga) => ({
  name: lga.name,
  id: lga.id,
});

const sendError = (res, status, message) => {
  res.status(status).send({
    status: "Failed",
    message,
  });
};

const sendSuccess = (res, status, body) => {
  res.status(status).send({
    status: "Success",
    ...body,
  });
};

const sendSuccessMessage = (res, status, message) => {
  sendSuccess(res, status, { message });
};

const sendGenericErrorMessage = (res) => {
  sendError(res, 500, "Something went wrong. Please try again.");
};

const sendMissingPropertyError = (res) => {
  sendError(res, 400, "All necessary details must be provided.");
};

const sendAuthError = (res) => {
  sendError(res, 401, "Invalid Auth Credentials");
};

const getBaseNinUrl = () =>
  process.env.NODE_ENV === "production"
    ? process.env.NIN_DEPLOYED_URL
    : process.env.NIN_LOCAL_URL;

const isDateValid = (dateString) => {
  let timestamp = Date.parse(dateString);

  return !isNaN(timestamp);
};

const ELECTION_POSTS = {
  PRESIDENTIAL: "Presidential",
  GUBERNATORIAL: "Gubernatorial",
  LGA: "Local Government Chairman",
};

const PRESIDENTIAL_ELECTION_ICON =
  "https://www.nigerianembassy.co.il/wp-content/uploads/2019/04/flag.jpg";

const SALT_ROUNDS = 10;

const JWT_ERRORS = ["TokenExpiredError"];

module.exports = {
  sanitizeVoter,
  sanitizeAdmin,
  sanitizeState,
  sanitizeLGA,
  sanitizeParty,
  sendError,
  sendSuccess,
  sendGenericErrorMessage,
  sendMissingPropertyError,
  sanitizePresidentialElection,
  sanitizeGubernatorialElection,
  sanitizeLGAElection,
  sendAuthError,
  isDateValid,
  sendSuccessMessage,
  getBaseNinUrl,
  PRESIDENTIAL_ELECTION_ICON,
  ELECTION_POSTS,
  SALT_ROUNDS,
};
