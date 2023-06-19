const { Voter } = require("../models/voter");
const { Admin } = require("../models/admin");
const {
  sendError,
  sendAuthError,
  sendGenericErrorMessage,
} = require("../utils/utils");
const jwt = require("jsonwebtoken");

const checkVoterOrAdminAuth = async (req, res, next) => {
  let bearerToken = req.get("Authorization");
  if (!bearerToken || typeof bearerToken !== "string")
    return sendAuthError(res);

  let [bearerString, token] = bearerToken.split(" ");
  if (!bearerString || bearerString !== "Bearer" || !token)
    return sendAuthError(res);
  let user;
  try {
    user = await jwt.verify(token, process.env.AUTH_KEY);
  } catch (e) {}

  try {
    if (!user) user = await jwt.verify(token, process.env.ADMIN_AUTH_KEY);
  } catch (e) {}

  if (!user) return sendAuthError(res);

  try {
    user = await Voter.findById(user?.voterId || "");
  } catch (e) {}

  try {
    if (!user) user = await Admin.findById(user?.adminId || "");
  } catch (e) {}

  if (!user) return sendAuthError(res);
  req.user = user;
  next();
};

const checkVoterAuth = async (req, res, next) => {
  let bearerToken = req.get("Authorization");
  if (!bearerToken || typeof bearerToken !== "string")
    return sendAuthError(res);

  let [bearerString, token] = bearerToken.split(" ");
  if (!bearerString || bearerString !== "Bearer" || !token)
    return sendAuthError(res);
  let voter;
  try {
    voter = await jwt.verify(token, process.env.AUTH_KEY);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!voter) return sendAuthError(res);

  try {
    voter = await Voter.findById(voter.voterId);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!voter) return sendAuthError(res);

  req.voter = voter;
  next();
};

const checkAdminAuth = async (req, res, next) => {
  let bearerToken = req.get("Authorization");
  if (!bearerToken || typeof bearerToken !== "string")
    return sendAuthError(res);

  let [bearerString, token] = bearerToken.split(" ");
  if (!bearerString || bearerString !== "Bearer" || !token)
    return sendAuthError(res);
  let admin;
  try {
    admin = await jwt.verify(token, process.env.AUTH_KEY);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!admin) return sendAuthError(res);

  try {
    admin = await Admin.findById(admin.adminId);
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!admin) return sendAuthError(res);

  req.admin = admin;
  next();
};

const middlewares = {
  checkVoterAuth,
  checkAdminAuth,
  checkVoterOrAdminAuth,
};

module.exports = {
  middlewares,
};
