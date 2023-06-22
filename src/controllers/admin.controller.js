const { Admin } = require("../models/admin");
const {
  sendMissingPropertyError,
  sendError,
  sendSuccessMessage,
  sendSuccess,
  sanitizeAdmin,
  SALT_ROUNDS,
} = require("../utils/utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return sendMissingPropertyError(res);

  //check if email exists
  let admin;
  try {
    admin = await Admin.findOne({ email });
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (admin) return sendError(res, 401, "This email is already taken");

  let salt = await bcrypt.genSalt(SALT_ROUNDS);
  let hash = await bcrypt.hash(password, salt);

  admin = new Admin({
    name,
    email,
    password: hash,
  });

  try {
    await admin.save();
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  return sendSuccessMessage(res, 201, "Admin created successfully");
};

const adminLogin = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) return sendMissingPropertyError(res);

  let admin;
  try {
    admin = await Admin.findOne({ email });
  } catch (e) {
    console.log(e);
    return sendGenericErrorMessage(res);
  }

  if (!admin) return sendError(res, 404, "Incorrect login credentials");

  let isPasswordCorrect = await bcrypt.compare(password, admin.password);
  if (!isPasswordCorrect)
    return sendError(res, 404, "Incorrect login credentials");

  //return sendSuccessMessage(res, 200, "passwords match");

  let authToken = jwt.sign(
    {
      adminId: admin.id,
    },
    process.env.ADMIN_AUTH_KEY,
    { expiresIn: "1h" }
  );

  let refreshToken = jwt.sign(
    {
      adminId: admin.id,
    },
    process.env.ADMIN_REFRESH_KEY
  );

  return sendSuccess(res, 200, {
    status: "Successful",
    admin: sanitizeAdmin(admin),
    authToken,
    refreshToken,
  });
};

const refreshAuthToken = async (req, res) => {
  const refToken = req.get("refreshToken");
  if (!refToken) return sendError(res, 401, "Invalid credentials");

  const admin = jwt.verify(refToken, process.env.ADMIN_REFRESH_KEY);

  if (!admin) return sendError(res, 401, "Invalid credentials");

  let authToken = jwt.sign(
    {
      adminId: admin.adminId,
    },
    process.env.ADMIN_AUTH_KEY,
    { expiresIn: "1h" }
  );

  return sendSuccess(res, 200, {
    message: "Token refreshed successfully",
    authToken,
  });
};

const adminController = {
  createAdmin,
  adminLogin,
  refreshAuthToken,
};

module.exports = {
  adminController,
};
