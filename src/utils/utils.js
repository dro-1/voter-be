const sanitizeVoter = (voter) => ({
  firstName: voter.firstName,
  lastName: voter.lastName,
  nin: voter.nin,
  middleName: voter.middleName,
  gender: voter.gender,
  address: voter.address,
  imageUrl: voter.imageUrl,
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

module.exports = {
  sanitizeVoter,
  sendError,
  sendSuccess,
  sendGenericErrorMessage,
  sendMissingPropertyError,
  sendSuccessMessage,
};
